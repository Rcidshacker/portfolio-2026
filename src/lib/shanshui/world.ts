import { Arch, Mount, Tree, setSeed, water } from "./engine";
import { PROJECT_STEP, STATIONS, VW_MAX, WORLD_H, WORLD_W, projectPeaks, stationById } from "../stations";

export type Band = "far" | "mid" | "near" | "front";
export type Quality = 1 | 2 | 3;

/** Parallax factor per band: how far the band travels per unit of camera travel. */
export const BAND_FACTOR: Record<Band, number> = { far: 0.18, mid: 0.5, near: 1, front: 1.4 };
export const BANDS: Band[] = ["far", "mid", "near", "front"];

export interface EntityMeta {
  id: string;
  kind: string;
  band: Band;
  x: number;
  y: number;
  /** Rough half-width in band units, for culling and hit-testing. */
  hw: number;
  /** Drawn as live SVG (sways, drifts, hovers) instead of being baked into a bitmap. */
  live?: boolean;
  /** Project index for station peaks. */
  project?: number;
  /** Skill-grove index for the five trees. */
  skill?: number;
}

/** Placement is cheap; the SVG is only produced when render() is called (once per entity, on demand). */
export interface Planned extends EntityMeta {
  render: () => string;
}

export interface Entity extends EntityMeta {
  svg: string;
}

export interface World {
  seed: number;
  width: number;
  height: number;
  entities: Entity[];
}

/** Content width of a band so the camera never runs out of painting. */
export const bandSpan = (band: Band) => (WORLD_W - VW_MAX) * BAND_FACTOR[band] + VW_MAX + 1200;

function hash(seed: number, label: string) {
  let h = (2166136261 ^ seed) >>> 0;
  for (let i = 0; i < label.length; i++) h = Math.imul(h ^ label.charCodeAt(i), 16777619) >>> 0;
  return h;
}

/** Deterministic plan: each entity is seeded by (seed, id) so edits elsewhere never reshuffle it. */
export function planWorld(seed: number, quality: Quality = 2): Planned[] {
  const t = quality === 3 ? 1 : quality === 2 ? 0.6 : 0.35;
  const plan: Planned[] = [];
  // cheap per-entity random stream, independent of the engine rng
  const R = (id: string) => {
    let a = hash(seed, id);
    return () => ((a = Math.imul(a ^ (a >>> 15), 2246822507) >>> 0), (a >>> 8) / 16777216);
  };

  const add = (
    band: Band,
    kind: string,
    id: string,
    x: number,
    y: number,
    hw: number,
    make: (r: () => number) => string,
    extra: Partial<EntityMeta> = {},
  ) => {
    plan.push({
      id, kind, band, x, y, hw,
      live: kind === "boat" || kind === "tree",
      ...extra,
      render: () => {
        setSeed(hash(seed, id));
        // The original patched NaN to -1000, which draws long diagonal lines; drop those polylines instead.
        return make(R(id)).replace(/<polyline[^>]*NaN[^>]*\/>/g, "");
      },
    });
  };

  const mount = (band: Band, id: string, x: number, y: number, hei: number, wid: number, extra: Partial<EntityMeta> = {}) =>
    add(band, "mount", id, x, y, wid / 2, (r) => Mount.mountain(x, y, r() * 100, { hei, wid, tex: Math.round(200 * t) }), extra);
  const flat = (band: Band, id: string, x: number, y: number, wid: number, hei = 90) =>
    add(band, "flat", id, x, y, wid / 2, (r) => Mount.flatMount(x, y, r() * 6, { wid, hei, tex: Math.round(80 * t), cho: 0.5 + r() * 0.15 }));
  const river = (band: Band, id: string, x: number, y: number, len: number) =>
    add(band, "water", id, x, y, len / 2, () => water(x, y, 0, { len, clu: Math.round(8 + 6 * t), hei: 2 }));
  const boat = (band: Band, id: string, x: number, y: number, sca: number, fli = false) =>
    add(band, "boat", id, x, y, 120 * sca, (r) => Arch.boat01(x, y, r(), { sca, fli }));

  // ── FAR: pale distant ridges ─────────────────────────────────────────────
  for (let x = -300, i = 0; x < bandSpan("far"); i++) {
    const r = R(`far-gap-${i}`);
    const y = 255 + r() * 40;
    const len = [500, 1000, 1500][Math.floor(r() * 3)];
    // distMount draws rightwards from its x, so the entity centre is x + len/2
    add("far", "dist", `far-${i}`, x + len / 2, y, len / 2, (rr) =>
      Mount.distMount(x, y, rr() * 100, { hei: 110 + rr() * 80, len }),
    );
    x += 620 + r() * 380;
  }

  // ── MID: wooded hills + a far river with tiny boats ──────────────────────
  for (let x = 0, i = 0; x < bandSpan("mid"); i++) {
    const r = R(`mid-gap-${i}`);
    const w = 300 + r() * 170;
    mount("mid", `mid-${i}`, x, 380 + r() * 60, 110 + r() * 110, w);
    if (i % 4 === 2) boat("mid", `mid-boat-${i}`, x + 200, 455, 0.38, r() > 0.5);
    x += 340 + r() * 240;
  }
  for (let x = 400, i = 0; x < bandSpan("mid"); x += 1900, i++) river("mid", `mid-river-${i}`, x, 440, 1500);

  // ── NEAR: stations. Everything the HTML overlays point at lives here (factor 1). ──
  const hero = stationById("hero").x;
  mount("near", "hero-l", hero - 600, 575, 390, 500);
  mount("near", "hero-r", hero + 640, 580, 350, 460);
  mount("near", "gap-hero-about", 1950, 580, 210, 380);
  flat("near", "gap-hero-about-flat", 1850, 690, 700);

  const about = stationById("about").x;
  river("near", "about-river", about, 650, 2400);
  boat("near", "about-boat", about - 60, 622, 1.15);
  flat("near", "about-shore-l", about - 1150, 690, 700);
  flat("near", "about-shore-r", about + 1150, 690, 800);

  projectPeaks.forEach((p) => {
    mount("near", `peak-${p.index}`, p.x, 585, p.featured ? 360 : 240, p.featured ? 470 : 340, { project: p.index });
    flat("near", `peak-flat-${p.index}`, p.x + PROJECT_STEP / 2, 690, 520 + (p.index % 3) * 120, 70);
  });

  const lastPeak = projectPeaks[projectPeaks.length - 1].x;
  mount("near", "gap-proj-skills-1", lastPeak + 900, 580, 230, 380);
  flat("near", "gap-proj-skills-flat", lastPeak + 1500, 690, 900);

  const skills = stationById("skills").x;
  flat("near", "skills-ground", skills, 690, 1900, 60);
  const grove = [Tree.tree01, Tree.tree03, Tree.tree05, Tree.tree08, Tree.tree04];
  grove.forEach((fn, k) => {
    const x = skills + (k - 2) * 340;
    add("near", "tree", `skill-tree-${k}`, x, 640, 90, () => fn(x, 640, { hei: [190, 120, 260, 150, 130][k] }), { skill: k });
  });

  const rec = stationById("recognition").x;
  flat("near", "rec-ground", rec, 690, 1500, 70);
  add("near", "pagoda", "rec-pagoda", rec, 600, 90, (r) => Arch.arch03(rec, 600, r(), { hei: 16, wid: 80, sto: 5 }));
  [-420, 420].forEach((dx, k) => mount("near", `rec-hill-${k}`, rec + dx * 1.6, 585, 200, 380));

  const contact = stationById("contact").x;
  river("near", "contact-river", contact, 655, 2200);
  boat("near", "contact-boat", contact - 40, 625, 1.5);
  flat("near", "contact-shore-l", contact - 1100, 690, 800);
  flat("near", "contact-shore-r", contact + 1100, 690, 800);
  mount("near", "gap-rec-contact", (rec + contact) / 2, 580, 250, 400);

  // ── FRONT: framing trees and rocks that slide past faster than the scene ──
  for (let x = 200, i = 0; x < bandSpan("front"); i++) {
    const r = R(`front-gap-${i}`);
    const kind = r();
    if (kind < 0.55) {
      add("front", "tree", `front-tree-${i}`, x, 705, 110, (rr) => (rr() > 0.5 ? Tree.tree05 : Tree.tree08)(x, 705, { hei: 160 + rr() * 140 }));
    } else {
      add("front", "rock", `front-rock-${i}`, x, 705, 70, (rr) => Mount.rock(x, 705, rr() * 50, { hei: 50 + rr() * 60, wid: 90 + rr() * 80, tex: Math.round(40 * t) }));
    }
    x += 520 + r() * 640;
  }

  // Painter's order inside each band: far-to-near by baseline y.
  return plan.sort((a, b) => a.y - b.y);
}

/** Eager variant for the lab and tests. The app uses planWorld + the worker. */
export function generateWorld(seed: number, quality: Quality = 2): World {
  const entities = planWorld(seed, quality).map(({ render, ...m }) => ({ ...m, svg: render() }));
  return { seed, width: WORLD_W, height: WORLD_H, entities };
}

export { STATIONS };
