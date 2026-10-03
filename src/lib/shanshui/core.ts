import { WORLD_H } from "../stations";
import { planWorld, type EntityMeta, type Band, type Planned, type Quality } from "./world";

/** Width of one baked bitmap, in band units. */
export const SEG = 1024;
/** Each bitmap overlaps its neighbours by PAD units per side so antialiased edges never leave a seam. */
export const PAD = 4;

// The engine only ever emits <polyline points='x,y x,y' style='fill:F;stroke:S;stroke-width:W'/>.
const POLY = /<polyline points='([^']*)' style='fill:([^;]*);stroke:([^;]*);stroke-width:([^']*)'\/>/g;

type Ctx = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;

const invisible = (c: string) => c === "none" || c === "rgba(0,0,0,0)";

/** Paint engine SVG onto a canvas whose transform is already set to band units. */
export function drawSvg(ctx: Ctx, svg: string) {
  POLY.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = POLY.exec(svg))) {
    const [, pts, fill, stroke, w] = m;
    const wid = parseFloat(w);
    const doFill = !invisible(fill);
    const doStroke = !invisible(stroke) && wid > 0;
    if (!doFill && !doStroke) continue;
    const p = pts.trim().split(" ");
    ctx.beginPath();
    for (let i = 0; i < p.length; i++) {
      const c = p[i].indexOf(",");
      const x = +p[i].slice(0, c);
      const y = +p[i].slice(c + 1);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    if (doFill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (doStroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = wid;
      ctx.stroke();
    }
  }
}

export type Baked = ImageBitmap | HTMLCanvasElement;

/** Owns the plan, renders entities lazily, bakes bitmaps. Runs in a worker, or on the main thread as fallback. */
export class WorldCore {
  private plan: Planned[];
  private svgCache = new Map<string, string>();
  constructor(
    readonly seed: number,
    quality: Quality,
  ) {
    this.plan = planWorld(seed, quality);
  }

  meta(): EntityMeta[] {
    return this.plan.map((p) => {
      const m: Partial<Planned> = { ...p };
      delete m.render;
      return m as EntityMeta;
    });
  }

  private svgOf(p: Planned) {
    let s = this.svgCache.get(p.id);
    if (s === undefined) this.svgCache.set(p.id, (s = p.render()));
    return s;
  }

  svgs(ids: string[]): Record<string, string> {
    const want = new Set(ids);
    const out: Record<string, string> = {};
    for (const p of this.plan) if (want.has(p.id)) out[p.id] = this.svgOf(p);
    return out;
  }

  /** Bake one band segment at `scale` canvas pixels per world unit. Live entities are skipped. */
  bake(band: Band, seg: number, scale: number): Baked {
    const x0 = seg * SEG - PAD;
    const w = Math.ceil((SEG + 2 * PAD) * scale);
    const h = Math.ceil(WORLD_H * scale);
    const useOffscreen = typeof OffscreenCanvas !== "undefined";
    const cvs = useOffscreen ? new OffscreenCanvas(w, h) : Object.assign(document.createElement("canvas"), { width: w, height: h });
    const ctx = cvs.getContext("2d", { willReadFrequently: true }) as Ctx;
    // Draw on paper white (the engine's white fills hide strokes behind them inside one band), then turn
    // "ink on white" into black-with-alpha. That is exactly what mix-blend-mode: multiply did at runtime,
    // but baked once, so the compositor only has to alpha-blend four plain layers per frame.
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    ctx.setTransform(scale, 0, 0, scale, -x0 * scale, 0);
    for (const p of this.plan) {
      if (p.band !== band || p.live) continue;
      const r = p.hw * 1.15 + 80;
      if (p.x + r < x0 || p.x - r > x0 + SEG + 2 * PAD) continue;
      drawSvg(ctx, this.svgOf(p));
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const m = Math.min(d[i], d[i + 1], d[i + 2]);
      d[i] = d[i + 1] = d[i + 2] = 0;
      d[i + 3] = 255 - m;
    }
    ctx.putImageData(img, 0, 0);
    return useOffscreen ? (cvs as OffscreenCanvas).transferToImageBitmap() : (cvs as HTMLCanvasElement);
  }
}
