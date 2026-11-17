'use client';

import { DndContext, DragOverlay, MouseSensor, TouchSensor, closestCenter, pointerWithin, useDraggable, useDroppable, useSensor, useSensors, type CollisionDetection, type DragMoveEvent, type Modifier } from '@dnd-kit/core';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { newestFirst, wallOrder } from '@/lib/order';
import { matchesSearch } from '@/lib/search';
import { WALL_PAGE_SIZE, type Entry } from '@/lib/types';
import { applyDrop, toTiles, type Drop, type Tile } from '@/lib/wall-layout';
import { useApp, useEntries } from '../AppProvider';
import { EmptyState } from './EmptyState';
import { WinNote, WinPile } from './WinNote';

// Figma: 186.67px notes, five across with 20px gaps from 160px down on desktop;
// 168px notes, two across with 12px gaps on phones.
// Phones always get two columns, 168px as in Figma and narrower on smaller screens
// (the note's text scales with it). Tablets and up fit as many full notes as they can.
export const GRID = 'grid justify-center gap-3 [grid-template-columns:repeat(2,minmax(0,168px))] sm:[grid-template-columns:repeat(auto-fill,168px)] lg:gap-5 lg:[grid-template-columns:repeat(auto-fill,186.67px)] xl:justify-start';

/** Where on a note the pointer is: the middle stacks onto it, the sides drop beside it. */
function dropMode(x: number, y: number, rect: { left: number; top: number; width: number; height: number }): Drop['mode'] {
  const across = (x - rect.left) / rect.width;
  const down = (y - rect.top) / rect.height;
  if (across > 0.25 && across < 0.75 && down > 0.15 && down < 0.85) return 'stack';
  return across < 0.5 ? 'before' : 'after';
}

// The note under the finger, or failing that the nearest one, so a drop in the gap between notes still lands.
const nearest: CollisionDetection = (args) => {
  const under = pointerWithin(args);
  return under.length ? under : closestCenter(args);
};

const isTouch = (event: Event | null) => !!event && 'touches' in event;

// A finger hides what it holds, so on touch the lifted note rides just above it.
const aboveFinger: Modifier = ({ transform, activatorEvent }) => (isTouch(activatorEvent) ? { ...transform, y: transform.y - 36 } : transform);

/** A short tap of the phone's vibration, where the device has one. Browsers only allow it
 *  once the page has been tapped, so it stays quiet before that rather than logging an error. */
const buzz = (ms: number) => {
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
  try { navigator.vibrate?.(ms); } catch {}
};

/** A name for the note's spot, so a view transition can glide it to its new one. */
const glideName = (key: string) => `tile-${key.replace(/[^a-zA-Z0-9-]/g, '-')}`;

function TileFace({ tile, onOpenStack }: { tile: Tile<Entry>; onOpenStack: (stackId: string) => void }) {
  if (tile.entries.length > 1 && tile.stackId) return <WinPile entries={tile.entries} onOpen={() => onOpenStack(tile.stackId!)} />;
  return <WinNote entry={tile.entries[0]} />;
}

/** One spot on the wall that can be picked up and dropped onto. */
function WallTile({ tile, drop, dragging, pressing, enabled, style, onOpenStack }: {
  tile: Tile<Entry>;
  drop: Drop | null;
  dragging: boolean;
  /** A finger is resting on it, about to pick it up. */
  pressing: boolean;
  enabled: boolean;
  style?: React.CSSProperties;
  onOpenStack: (stackId: string) => void;
}) {
  const draggable = useDraggable({ id: tile.key, disabled: !enabled });
  const droppable = useDroppable({ id: tile.key, disabled: !enabled });
  const target = drop?.key === tile.key ? drop.mode : null;
  const inOpenStack = tile.stackId !== null && tile.entries.length === 1;

  return (
    <li
      ref={(node) => { draggable.setNodeRef(node); droppable.setNodeRef(node); }}
      {...draggable.listeners}
      // While lifted, the drag overlay carries the glide name instead.
      style={{ ...style, viewTransitionName: dragging ? undefined : glideName(tile.key) }}
      onContextMenu={enabled ? (event) => event.preventDefault() : undefined}
      className={`relative touch-manipulation select-none [-webkit-touch-callout:none] ${inOpenStack ? 'rounded-md outline-2 outline-offset-4 outline-dashed outline-[#1568d4]/35' : ''}`}
    >
      {/* Held down, the note sinks a little over the hold time, so people feel it about to lift. */}
      <div className={`transition-[opacity,scale] [&_img]:[-webkit-user-drag:none] ${pressing ? 'scale-[0.95] duration-[250ms] ease-out' : 'duration-150'} ${dragging ? 'opacity-30' : ''} ${target === 'stack' ? 'scale-[1.04]' : ''}`}>
        <TileFace tile={tile} onOpenStack={onOpenStack} />
      </div>
      {target === 'stack' && <span aria-hidden className="pointer-events-none absolute inset-[-6px] rounded-lg border-2 border-[#1568d4] bg-[#1568d4]/8" />}
      {(target === 'before' || target === 'after') && (
        <span aria-hidden className={`pointer-events-none absolute top-[8%] bottom-[8%] w-1 rounded-full bg-[#1568d4] ${target === 'before' ? '-left-2 lg:-left-3' : '-right-2 lg:-right-3'}`} />
      )}
    </li>
  );
}

/** `stagger` drops the second win lower, as the website's phone shot pins them in Figma. */
export function WallView({ entries: firstPage, hasMore: initialHasMore, stagger = false }: { entries: Entry[]; hasMore: boolean; stagger?: boolean }) {
  const { store, filter, setFilter, saveEntry } = useApp();
  const [older, setOlder] = useState<Entry[]>([]);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [results, setResults] = useState<Entry[] | null>(null);
  const [openStacks, setOpenStacks] = useState<ReadonlySet<string>>(new Set());
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [drop, setDrop] = useState<Drop | null>(null);
  const droppedAt = useRef(0);
  const loading = useRef(false);
  const sentinel = useRef<HTMLDivElement>(null);

  // A mouse picks a note up once it moves a little; a finger holds it for a moment
  // first, so swiping still scrolls the wall.
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
  );

  // A search from the header narrows the wall to matching wins.
  useEffect(() => {
    let current = true;
    setResults(null);
    if (filter) store.search({ q: filter.q, categoryId: filter.categoryId }).then((found) => { if (current) setResults(found); }, () => { if (current) setResults([]); });
    return () => { current = false; };
  }, [filter, store]);

  // Only wins still on the wall; unpinned ones live on in History.
  const matches = (entry: Entry) => entry.on_wall !== false && (!filter || matchesSearch(entry, { q: filter.q, category: filter.categoryId, year: '' }));
  // Search results are a plain list, newest first; the wall itself keeps the order and stacks people made.
  const shown = useEntries(filter ? results ?? [] : [...firstPage, ...older], matches).sort(filter ? newestFirst : wallOrder);
  const tiles = filter ? shown.map((entry) => ({ key: entry.id, stackId: null, entries: [entry] })) : toTiles(shown, openStacks);
  const arranging = !filter;

  // More of the wall loads as the last row comes into view.
  useEffect(() => {
    const target = sentinel.current;
    if (!target || filter || !hasMore) return;
    const watcher = new IntersectionObserver(async ([seen]) => {
      if (!seen.isIntersecting || loading.current) return;
      const last = older.at(-1) ?? firstPage.at(-1);
      if (!last) return;
      loading.current = true;
      try {
        const next = await store.entriesBefore(last, WALL_PAGE_SIZE + 1);
        setOlder((current) => [...current, ...next.slice(0, WALL_PAGE_SIZE)]);
        setHasMore(next.length > WALL_PAGE_SIZE);
      } finally {
        loading.current = false;
      }
    }, { rootMargin: '600px' });
    watcher.observe(target);
    return () => watcher.disconnect();
  }, [filter, hasMore, older, firstPage, store]);

  if (!filter && !shown.length) {
    return <EmptyState title="Wall is empty">Your wall is waiting.<br />What has God done for you today?</EmptyState>;
  }

  const openStack = (stackId: string) => setOpenStacks((current) => new Set(current).add(stackId));
  const closeStack = (stackId: string) => setOpenStacks((current) => { const next = new Set(current); next.delete(stackId); return next; });
  // Unstacking leaves each win where it is, as a note of its own.
  const unstack = (stackId: string) => {
    for (const entry of shown) if (entry.stack_id === stackId) void saveEntry({ ...entry, stack_id: null });
    closeStack(stackId);
  };

  function onDragMove({ active, over, delta, activatorEvent }: DragMoveEvent) {
    if (!over || over.id === active.id) return setDrop(null);
    const start = 'touches' in activatorEvent ? (activatorEvent as TouchEvent).touches[0] : (activatorEvent as MouseEvent);
    const next: Drop = { key: String(over.id), mode: dropMode(start.clientX + delta.x, start.clientY + delta.y, over.rect) };
    // A light tick each time the drop would stack, so a finger feels it without seeing under itself.
    if (next.mode === 'stack' && (drop?.mode !== 'stack' || drop.key !== next.key) && isTouch(activatorEvent)) buzz(8);
    setDrop(next);
  }

  function start(key: string, touch: boolean) {
    setPendingKey(null);
    setActiveKey(key);
    if (touch) buzz(12);
  }

  function finish() {
    const changes = activeKey && drop ? applyDrop(tiles, activeKey, drop) : [];
    droppedAt.current = Date.now();
    const settle = () => {
      for (const entry of changes) void saveEntry(entry);
      setActiveKey(null);
      setDrop(null);
    };
    // Notes glide from where they were to where they land, and the dropped one from under the finger.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (document.startViewTransition && !reduced) document.startViewTransition(() => flushSync(settle));
    else settle();
  }

  const activeTile = tiles.find((tile) => tile.key === activeKey);
  // The last win of each opened stack, where the button to gather it back up goes.
  const lastOfStack = new Map<string, number>();
  tiles.forEach((tile, index) => { if (tile.stackId && tile.entries.length === 1) lastOfStack.set(tile.stackId, index); });

  return (
    <div className="mx-auto px-[22.5px] pb-40 lg:max-w-[min(1020px,calc(100vw-260px))] lg:px-0 lg:pt-[60px] lg:pb-24">
      {filter && (
        <div className="mb-5 flex items-center justify-center gap-2 font-avenir text-sm text-[var(--d-soft)]">
          <span>Showing <strong className="font-medium text-[var(--d-text)]">{filter.label}</strong></span>
          <button type="button" onClick={() => setFilter(null)} className="rounded-xl bg-[var(--d-field)] px-3 py-1 text-[var(--d-text)]">Clear</button>
        </div>
      )}
      {filter && results && !shown.length ? (
        <p className="pt-16 text-center font-avenir text-base text-[var(--d-soft)]">No wins match “{filter.label}”.</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={nearest}
          onDragPending={({ id, constraint }) => { if ('delay' in constraint) setPendingKey(String(id)); }}
          onDragAbort={() => setPendingKey(null)}
          onDragStart={({ active, activatorEvent }) => start(String(active.id), isTouch(activatorEvent))}
          onDragMove={onDragMove}
          onDragEnd={finish}
          onDragCancel={() => { setPendingKey(null); setActiveKey(null); setDrop(null); }}
        >
          {/* A drag ends with a click on the note underneath; swallow it so the note doesn't open. */}
          <ul className={GRID} onClickCapture={(event) => { if (Date.now() - droppedAt.current < 300) { event.preventDefault(); event.stopPropagation(); } }}>
            {tiles.map((tile, index) => [
              <WallTile
                key={tile.key}
                tile={tile}
                drop={drop}
                dragging={tile.key === activeKey}
                pressing={tile.key === pendingKey}
                enabled={arranging}
                style={stagger && index === 1 ? { marginTop: 'var(--stagger, 0px)' } : undefined}
                onOpenStack={openStack}
              />,
              tile.stackId && lastOfStack.get(tile.stackId) === index && (
                <li key={`gather:${tile.stackId}`} className="flex flex-col items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => closeStack(tile.stackId!)}
                    className="w-[150px] rounded-xl border-2 border-dashed border-[#1568d4]/40 px-4 py-3 font-avenir text-sm font-medium text-[#1568d4]"
                  >
                    Stack them again
                  </button>
                  <button
                    type="button"
                    onClick={() => unstack(tile.stackId!)}
                    className="w-[150px] rounded-xl border-2 border-[#1568d4]/40 bg-[#1568d4]/8 px-4 py-3 font-avenir text-sm font-medium text-[#1568d4]"
                  >
                    Unstack
                  </button>
                </li>
              ),
            ])}
          </ul>
          <DragOverlay dropAnimation={null} modifiers={[aboveFinger]}>
            {activeTile && (
              <div style={{ viewTransitionName: glideName(activeTile.key) }} className="lift-in rotate-[-3deg] scale-105 cursor-grabbing drop-shadow-[0_18px_24px_rgba(9,45,110,0.25)]">
                <TileFace tile={activeTile} onOpenStack={() => {}} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}
      <div ref={sentinel} aria-hidden="true" />
    </div>
  );
}
