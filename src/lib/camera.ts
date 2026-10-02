import { STATIONS, WORLD_H, WORLD_W, projectPeaks } from "./stations";

/** Scroll pixels per screen pixel of near-band travel. <1 means the painting moves faster than the page scrolls. */
export const SCROLL_RATIO = 0.42;
/** Time spent holding on each stop, in world units of travel. */
const DWELL = 480;

export interface Focus {
  id: string;
  /** Station this stop belongs to. */
  station: string;
  /** World x to centre in the viewport. */
  x: number;
  /** Project index when the stop is a project peak. */
  project?: number;
}

/** Ordered stops: every station, with the projects station expanded into one stop per peak. */
export const FOCUSES: Focus[] = STATIONS.flatMap<Focus>((s) =>
  s.id === "projects"
    ? projectPeaks.map((p) => ({ id: `project-${p.index}`, station: "projects", x: p.x, project: p.index }))
    : [{ id: s.id, station: s.id, x: s.x }],
);

const smooth = (t: number) => t * t * (3 - 2 * t);

export interface Camera {
  /** Largest camera x (left edge of the viewport, world units). */
  camMax: number;
  /** Camera x for scroll progress 0..1. */
  at(progress: number): number;
  /** Scroll progress at which focus i is centred (start of its dwell). */
  progressOf(i: number): number;
  /** Index of the focus the camera is at or travelling toward, for progress 0..1. */
  focusAt(progress: number): number;
  /** Total scroll distance for a viewport of the given pixel height. */
  scrollLength(vh: number): number;
}

/** @param vw viewport width in world units (vh px = WORLD_H units). */
export function makeCamera(vw: number): Camera {
  const camMax = Math.max(0, WORLD_W - vw);
  const cams = FOCUSES.map((f) => Math.min(camMax, Math.max(0, f.x - vw / 2)));

  // Timeline in weight units: [dwell_0][travel_0->1][dwell_1]...
  const start: number[] = []; // weight where dwell i begins
  let w = 0;
  for (let i = 0; i < cams.length; i++) {
    start.push(w);
    w += DWELL;
    if (i < cams.length - 1) w += Math.abs(cams[i + 1] - cams[i]);
  }
  const total = w;

  return {
    camMax,
    progressOf: (i) => start[i] / total,
    focusAt(p) {
      const wt = p * total;
      let i = 0;
      for (let k = 0; k < cams.length; k++) {
        // switch to the next focus halfway through the travel toward it
        const next = k + 1 < cams.length ? start[k + 1] - (start[k + 1] - (start[k] + DWELL)) / 2 : Infinity;
        if (wt < next) {
          i = k;
          break;
        }
      }
      return i;
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
    // Scroll length so near-band screen travel stays comparable at any viewport size.
    scrollLength: (vh) => total * (vh / WORLD_H) * SCROLL_RATIO,
  };
}
