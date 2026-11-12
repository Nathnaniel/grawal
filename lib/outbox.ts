// Every save goes through here first, so a win is on the device before the
// network is involved. Anything that can't reach the server waits and retries.

export type Operation<T> =
  | { kind: 'save'; id: string; entry: T }
  | { kind: 'remove'; id: string };

type Queued<T> = Operation<T> & { version: number };

export interface OutboxStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface Outbox<T> {
  enqueue(operation: Operation<T>): void;
  flush(): Promise<void>;
  pending(): Operation<T>[];
}

export function createOutbox<T>(options: {
  key: string;
  storage: OutboxStorage;
  send: (operation: Operation<T>) => Promise<void>;
  onChange?: () => void;
}): Outbox<T> {
  const { key, storage, send, onChange } = options;
  let queue = read();
  let version = queue.reduce((highest, item) => Math.max(highest, item.version), 0);
  let flushing: Promise<void> | null = null;
  let flushAgain = false;

  function read(): Queued<T>[] {
    try {
      const parsed = JSON.parse(storage.getItem(key) ?? '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function write() {
    try {
      storage.setItem(key, JSON.stringify(queue));
    } catch {
      // Storage can be full or blocked. The queue still works for this visit.
    }
    onChange?.();
  }

  async function drain() {
    for (const item of [...queue]) {
      try {
        await send(item);
      } catch {
        continue; // Stays queued for the next attempt.
      }
      // Only clear what was sent. A newer change made meanwhile still has to go.
      queue = queue.filter((queued) => queued.id !== item.id || queued.version !== item.version);
      write();
    }
  }

  return {
    // A newer change to the same entry replaces the older one.
    enqueue(operation) {
      queue = [...queue.filter((item) => item.id !== operation.id), { ...operation, version: ++version }];
      write();
    },

    flush() {
      if (flushing) {
        flushAgain = true;
        return flushing;
      }
      flushing = (async () => {
        do {
          flushAgain = false;
          await drain();
        } while (flushAgain);
        flushing = null;
      })();
      return flushing;
    },

    pending: () => queue.map(({ version: _version, ...operation }) => operation as Operation<T>),
  };
}
