import { projects } from "./data";
import { STATIONS, WORLD_H, WORLD_W, projectPeaks } from "./stations";

/** Scroll pixels per screen pixel of near-band travel. <1 means the painting moves faster than the page scrolls. */
export const SCROLL_RATIO = 0.42;
/** Flat stretch of scroll around each stop; the snap point is its centre. */
const DWELL = 240;

export interface Focus {
  id: string;
  /** Station this stop belongs to. */
  station: string;
  /** World x to bring into view. */
  x: number;
  /** Where on screen (0..1 from the left) the stop's x lands. Side-panel stops sit left of centre. */
  anchor: number;
  /** Project index when the stop is a project peak. */
  project?: number;
}

const SIDE = 0.3;
const SIDE_STATIONS = new Set(["skills", "recognition"]);

/** Ordered stops: every station, with the projects station expanded into one stop per peak. */
export const FOCUSES: Focus[] = STATIONS.flatMap<Focus>((s) =>
  s.id === "projects"
    ? projectPeaks.map((p) => ({ id: `project-${p.index}`, station: "projects", x: p.x, anchor: SIDE, project: p.index }))
    : [{ id: s.id, station: s.id, x: s.x, anchor: SIDE_STATIONS.has(s.id) ? SIDE : 0.5 }],
);

/** A project stop is skipped while a category filter hides it; every other stop is always visible. */
export function isVisibleFocus(i: number, filter: string) {
  const p = FOCUSES[i].project;
  return p === undefined || filter === "All" || projects[p].category === filter;
}

/** Nearest visible stop in a direction, or -1 at the ends. */
export function nextVisible(from: number, dir: 1 | -1, filter: string) {
  for (let i = from + dir; i >= 0 && i < FOCUSES.length; i += dir) if (isVisibleFocus(i, filter)) return i;
  return -1;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

export interface Camera {
  /** Camera x (left edge of the viewport, world units) for scroll progress 0..1. */
  at(progress: number): number;
  /** Camera x at the snap point of stop i. */
  camOf(i: number): number;
  /** Scroll progress of the snap point of stop i. */
  progressOf(i: number): number;
  /** Stop whose snap point is closest to this progress. */
  focusAt(progress: number): number;
  /** Total scroll distance for a viewport of the given pixel height. */
  scrollLength(vh: number): number;
}

/** @param vw viewport width in world units (vh px = WORLD_H units); narrow viewports centre every stop. */
export function makeCamera(vw: number, narrow = false): Camera {
  const camMax = Math.max(0, WORLD_W - vw);
  const cams = FOCUSES.map((f) => Math.min(camMax, Math.max(0, f.x - vw * (narrow ? 0.5 : f.anchor))));

  // Timeline in weight units: [dwell_0][travel_0->1][dwell_1]...
  const start: number[] = [];
  let w = 0;
  for (let i = 0; i < cams.length; i++) {
    start.push(w);
    w += DWELL;
    if (i < cams.length - 1) w += Math.abs(cams[i + 1] - cams[i]);
  }
  const total = w;
  const mid = (i: number) => (start[i] + DWELL / 2) / total;

  return {
    camOf: (i) => cams[i],
    progressOf: mid,
    focusAt(p) {
      let best = 0;
      for (let i = 1; i < cams.length; i++) if (Math.abs(p - mid(i)) < Math.abs(p - mid(best))) best = i;
      return best;
    },
    at(p) {
      const wt = Math.min(total, Math.max(0, p * total));
      for (let i = 0; i < cams.length; i++) {
        const dwellEnd = start[i] + DWELL;
        if (wt <= dwellEnd || i === cams.length - 1) return cams[i];
        const travelEnd = start[i + 1];
        if (wt < travelEnd) return cams[i] + (cams[i + 1] - cams[i]) * smooth((wt - dwellEnd) / (travelEnd - dwellEnd));
      }
      return cams[cams.length - 1];
    },
    scrollLength: (vh) => total * (vh / WORLD_H) * SCROLL_RATIO,
  };
}
