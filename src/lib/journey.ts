"use client";
import { useSyncExternalStore } from "react";

/** Slow-changing state React reads (re-renders only when these change). */
interface State {
  focus: number;
  ready: boolean;
  /** Project category filter ("All" shows every peak). */
  filter: string;
  /** Project index under the pointer or keyboard focus, -1 for none. */
  hover: number;
  seed: number;
}

const initial: State = { focus: 0, ready: false, filter: "All", hover: -1, seed: 7 };
let state: State = initial;
const subs = new Set<() => void>();

/** Per-frame values: read from refs/rAF, never from React state. */
export const frame = {
  progress: 0,
  camX: 0,
  /** Screen pixels per world unit. */
  scale: 1,
  vwUnits: 1400,
  /** Pointer in -1..1, eased. */
  mx: 0,
  my: 0,
};

const frameSubs = new Set<() => void>();
export const onFrame = (cb: () => void) => (frameSubs.add(cb), () => void frameSubs.delete(cb));
export const emitFrame = () => frameSubs.forEach((f) => f());

const noop1 = () => {};

export const journey = {
  set(patch: Partial<State>) {
    const next = { ...state, ...patch };
    if ((Object.keys(next) as (keyof State)[]).every((k) => next[k] === state[k])) return;
    state = next;
    subs.forEach((s) => s());
  },
  get: () => state,
  /** Registered by the stage; jumps the page scroll to a focus index. */
  goTo: noop1 as (index: number) => void,
  /** Registered by the stage: new random world / export the current view as SVG. */
  reroll: () => {},
  download: () => {},
};

export function useJourney<T>(select: (s: State) => T): T {
  return useSyncExternalStore(
    (cb) => (subs.add(cb), () => void subs.delete(cb)),
    () => select(state),
    () => select(initial),
  );
}
