import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createOutbox, type Operation } from '../lib/outbox.ts';

type Win = { title: string };

function memoryStorage() {
  const items = new Map<string, string>();
  return { getItem: (k: string) => items.get(k) ?? null, setItem: (k: string, v: string) => void items.set(k, v) };
}

const save = (id: string, title: string): Operation<Win> => ({ kind: 'save', id, entry: { title } });

test('a sent save leaves the queue', async () => {
  const sent: Operation<Win>[] = [];
  const box = createOutbox<Win>({ key: 'k', storage: memoryStorage(), send: async (op) => void sent.push(op) });
  box.enqueue(save('1', 'First'));
  await box.flush();
  assert.equal(sent.length, 1);
  assert.deepEqual(box.pending(), []);
});

test('a failed save stays queued and goes through on retry', async () => {
  let online = false;
  const sent: string[] = [];
  const box = createOutbox<Win>({
    key: 'k',
    storage: memoryStorage(),
    send: async (op) => {
      if (!online) throw new Error('offline');
      sent.push(op.id);
    },
  });
  box.enqueue(save('1', 'First'));
  await box.flush();
  assert.equal(box.pending().length, 1);
  online = true;
  await box.flush();
  assert.deepEqual(sent, ['1']);
  assert.deepEqual(box.pending(), []);
});

test('one failure does not hold up the saves behind it', async () => {
  const sent: string[] = [];
  const box = createOutbox<Win>({
    key: 'k',
    storage: memoryStorage(),
    send: async (op) => {
      if (op.id === '1') throw new Error('rejected');
      sent.push(op.id);
    },
  });
  box.enqueue(save('1', 'Stuck'));
  box.enqueue(save('2', 'Fine'));
  await box.flush();
  assert.deepEqual(sent, ['2']);
  assert.deepEqual(box.pending().map((op) => op.id), ['1']);
});

test('queued saves survive a reload', async () => {
  const storage = memoryStorage();
  const offline = async () => { throw new Error('offline'); };
  createOutbox<Win>({ key: 'k', storage, send: offline }).enqueue(save('1', 'Kept'));
  const sent: string[] = [];
  const reloaded = createOutbox<Win>({ key: 'k', storage, send: async (op) => void sent.push(op.id) });
  assert.equal(reloaded.pending().length, 1);
  await reloaded.flush();
  assert.deepEqual(sent, ['1']);
});

test('two people on one device keep separate queues', () => {
  const storage = memoryStorage();
  const send = async () => {};
  createOutbox<Win>({ key: 'outbox.a', storage, send }).enqueue(save('1', 'Private'));
  assert.deepEqual(createOutbox<Win>({ key: 'outbox.b', storage, send }).pending(), []);
});

test('a newer change replaces the queued one', async () => {
  const sent: Operation<Win>[] = [];
  const box = createOutbox<Win>({ key: 'k', storage: memoryStorage(), send: async (op) => void sent.push(op) });
  box.enqueue(save('1', 'Draft'));
  box.enqueue(save('1', 'Final'));
  await box.flush();
  assert.deepEqual(sent, [save('1', 'Final')].map((op) => ({ ...op, version: 2 })));
});

test('a change made while a save is in flight is not lost', async () => {
  const titles: string[] = [];
  let release = () => {};
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const box = createOutbox<Win>({
    key: 'k',
    storage: memoryStorage(),
    send: async (op) => {
      if (op.kind === 'save') titles.push(op.entry.title);
      if (titles.length === 1) await gate;
    },
  });
  box.enqueue(save('1', 'First'));
  const flushed = box.flush();
  box.enqueue(save('1', 'Edited'));
  box.flush();
  release();
  await flushed;
  assert.deepEqual(titles, ['First', 'Edited']);
  assert.deepEqual(box.pending(), []);
});

test('overlapping flushes do not send a save twice', async () => {
  let sends = 0;
  const box = createOutbox<Win>({ key: 'k', storage: memoryStorage(), send: async () => { sends += 1; } });
  box.enqueue(save('1', 'Once'));
  await Promise.all([box.flush(), box.flush()]);
  assert.equal(sends, 1);
});

test('corrupt storage starts an empty queue', () => {
  const storage = memoryStorage();
  storage.setItem('k', '{not json');
  assert.deepEqual(createOutbox<Win>({ key: 'k', storage, send: async () => {} }).pending(), []);
});
