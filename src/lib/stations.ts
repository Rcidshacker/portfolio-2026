import { projects } from "./data";

/** World units: the painting is 700 tall (same space as the original shan-shui-inf viewBox). */
export const WORLD_H = 700;
/** Widest viewport (in world units) we ever need to cover; 21:9 at height 700. */
export const VW_MAX = 1700;
export const WORLD_W = 15800;

export type StationId = "hero" | "about" | "projects" | "skills" | "recognition" | "contact";

export interface Station {
  id: StationId;
  /** World x of the station's centre, in near-band units. */
  x: number;
  jp: string;
  label: string;
}

export const STATIONS: Station[] = [
  { id: "hero", x: 800, jp: "序", label: "Prologue" },
  { id: "about", x: 2700, jp: "人", label: "About" },
  { id: "projects", x: 4300, jp: "作", label: "Projects" },
  { id: "skills", x: 10900, jp: "技", label: "Skills" },
  { id: "recognition", x: 12800, jp: "賞", label: "Recognition" },
  { id: "contact", x: 14800, jp: "結", label: "Contact" },
];

/** One peak per project, left to right. Featured projects get the taller peaks. */
export const PROJECT_X0 = 4300;
export const PROJECT_STEP = 760;
export const projectPeaks = projects.map((p, i) => ({
  index: i,
  title: p.title,
  featured: !!p.featured,
  x: PROJECT_X0 + i * PROJECT_STEP,
}));

/** Camera scroll range (world x of the left edge of the viewport). */
export const stationById = (id: StationId) => STATIONS.find((s) => s.id === id)!;
