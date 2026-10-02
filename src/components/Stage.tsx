"use client";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createWorld, type WorldClient } from "@/lib/shanshui/client";
import { PAD, SEG, type Baked } from "@/lib/shanshui/core";
import { BANDS, BAND_FACTOR, type Band, type EntityMeta, type Quality } from "@/lib/shanshui/world";
import { FOCUSES, makeCamera } from "@/lib/camera";
import { WORLD_H, WORLD_W } from "@/lib/stations";
import { emitFrame, frame, journey, useJourney } from "@/lib/journey";
import { projectPeaks } from "@/lib/stations";
import Birds from "./Birds";

gsap.registerPlugin(ScrollTrigger);

/** Far bands are soft anyway, so bake them smaller: less memory, same look. */
const BAKE_QUALITY: Record<Band, number> = { far: 0.6, mid: 0.8, near: 1, front: 1 };
/** Pointer parallax in px at the extremes, per band. */
const MOUSE_DEPTH: Record<Band, number> = { far: -4, mid: -9, near: -16, front: -30 };

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Seed comes from ?seed=; digits only, so nothing but a number ever reaches the generator. */
function readSeed() {
  const q = new URLSearchParams(window.location.search).get("seed");
  const n = q !== null && /^d{1,9}$/.test(q) ? parseInt(q, 10) : NaN;
  return Number.isFinite(n) ? n : 7;
}

export default function Stage({ children }: { children: ReactNode }) {
  const journeyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);
  const bandEls = useRef<Record<Band, HTMLDivElement | null>>({ far: null, mid: null, near: null, front: null });
  const segHost = useRef<Record<Band, HTMLDivElement | null>>({ far: null, mid: null, near: null, front: null });
  const sunRef = useRef<HTMLDivElement>(null);

  const [dims, setDims] = useState({ vw: 1440, vh: 900, dpr: 1 });
  const [live, setLive] = useState<{ meta: EntityMeta; svg: string }[]>([]);
  const [seed, setSeed] = useState(() => (typeof window === "undefined" ? 7 : readSeed()));
  const metaRef = useRef<EntityMeta[]>([]);
  const focusIdx = useJourney((st) => st.focus);
  const hover = useJourney((st) => st.hover);
  const glow = hover >= 0 ? hover : (FOCUSES[focusIdx].project ?? -1);
  const [liveBucket, setLiveBucket] = useState(0);
  const [glowSvg, setGlowSvg] = useState<{ i: number; svg: string } | null>(null);
  const s = dims.vh / WORLD_H;
  const vwUnits = Math.round(dims.vw / s / 20) * 20;
  const camera = useMemo(() => makeCamera(vwUnits), [vwUnits]);
  const scrollLen = camera.scrollLength(dims.vh);

  // ── viewport size ──────────────────────────────────────────────────────────
  useEffect(() => {
    const read = () =>
      setDims((d) => {
        const vh = stageRef.current?.clientHeight || window.innerHeight;
        const vw = window.innerWidth;
        // ignore mobile URL-bar height jitter
        if (vw === d.vw && Math.abs(vh - d.vh) < 80) return d;
        return { vw, vh, dpr: Math.min(window.devicePixelRatio || 1, 1.5) };
      });
    read();
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => (clearTimeout(t), (t = setTimeout(read, 120)));
    window.addEventListener("resize", onResize);
    return () => (window.removeEventListener("resize", onResize), clearTimeout(t));
  }, []);

  // ── world + camera loop ────────────────────────────────────────────────────
  const worldRef = useRef<WorldClient | null>(null);
  const goTo = useRef<(i: number) => void>(() => {});

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const quality: Quality = dims.vw < 700 || (navigator.hardwareConcurrency || 8) <= 4 ? 1 : 2;
    const world = createWorld(seed, quality);
    worldRef.current = world;
    let alive = true;
    journey.set({ seed });
    stageRef.current?.classList.add("swap");

    world.meta.then(async (meta) => {
      metaRef.current = meta;
      const ids = meta.filter((m) => m.live).map((m) => m.id);
      const svgs = await world.svgs(ids);
      if (alive) setLive(meta.filter((m) => m.live).map((m) => ({ meta: m, svg: svgs[m.id] })));
    });

    frame.scale = s;
    frame.vwUnits = vwUnits;

    // Baked bitmaps become plain canvases appended to each band (no React in the hot path).
    const segEls = new Map<string, HTMLCanvasElement>();
    const asked = new Set<string>();
    const queued = new Map<string, { b: Band; seg: number }>();
    let inflight = 0;
    let settled = false;
    const bakeScale = (b: Band) => s * dims.dpr * BAKE_QUALITY[b];

    const mountSeg = (b: Band, seg: number, bmp: Baked) => {
      const key = `${b}:${seg}`;
      const host = segHost.current[b];
      if (!alive || !host || !asked.has(key)) return (bmp as ImageBitmap).close?.();
      let c: HTMLCanvasElement;
      if (bmp instanceof HTMLCanvasElement) c = bmp; // main-thread fallback already drew into a canvas
      else {
        c = document.createElement("canvas");
        c.width = bmp.width;
        c.height = bmp.height;
        c.getContext("bitmaprenderer")!.transferFromImageBitmap(bmp); // zero-copy, GPU-resident
      }
      c.style.cssText = `position:absolute;top:0;left:${(seg * SEG - PAD) * s}px;width:${(SEG + 2 * PAD) * s}px;height:${WORLD_H * s}px`;
      segEls.set(key, c);
      host.appendChild(c);
    };

    // Bake queue: at most 2 jobs in flight, always the nearest wanted segment first, so a fast jump
    // across the world never leaves the destination waiting behind segments we already flew past.
    const pump = () => {
      while (inflight < 2 && queued.size) {
        let best: string | null = null;
        let bestD = Infinity;
        for (const [key, { b, seg }] of queued) {
          const d = Math.abs((seg + 0.5) * SEG - (frame.camX * BAND_FACTOR[b] + vwUnits / 2)) + (3 - BANDS.indexOf(b)) * 30;
          if (d < bestD) {
            bestD = d;
            best = key;
          }
        }
        const { b, seg } = queued.get(best!)!;
        queued.delete(best!);
        asked.add(best!);
        inflight++;
        world.bake(b, seg, bakeScale(b)).then((bmp) => {
          inflight--;
          mountSeg(b, seg, bmp);
          if (alive) pump();
        });
      }
      if (!settled && alive && !inflight && !queued.size) {
        settled = true;
        journey.set({ ready: true });
        stageRef.current?.classList.remove("swap");
      }
    };

    const ensureSegments = () => {
      const wanted = new Set<string>();
      for (const b of BANDS) {
        const x0 = frame.camX * BAND_FACTOR[b];
        const a = Math.floor((x0 - 300) / SEG);
        const z = Math.floor((x0 + vwUnits + 300) / SEG);
        for (let seg = Math.max(0, a); seg <= z; seg++) {
          const key = `${b}:${seg}`;
          wanted.add(key);
          if (!asked.has(key) && !queued.has(key)) queued.set(key, { b, seg });
        }
        for (const [key, el] of segEls) {
          if (!key.startsWith(b + ":")) continue;
          const seg = +key.split(":")[1];
          if (seg < a - 2 || seg > z + 2) {
            el.remove();
            segEls.delete(key);
            asked.delete(key);
          }
        }
      }
      for (const key of queued.keys()) if (!wanted.has(key)) queued.delete(key);
      pump();
    };

    // ── scroll + camera ──
    const lenis = reduced ? null : new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    lenis?.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!reduced) window.addEventListener("pointermove", onPointer, { passive: true });

    const topY = journeyRef.current?.offsetTop ?? 0;
    const top = () => topY;
    let lastCam = NaN;
    let lastMx = NaN;
    let lastFocus = -1;
    let lastBucket = -1;

    frame.camX = camera.at(0);
    const tick = (_t: number, dt: number) => {
      lenis?.raf(performance.now());
      const y = lenis ? lenis.scroll : window.scrollY;
      const p = clamp((y - top()) / scrollLen, 0, 1);
      frame.progress = p;
      const target = camera.at(p);
      frame.camX += (target - frame.camX) * (reduced ? 1 : 1 - Math.exp((-dt / 1000) * 9));
      if (Math.abs(target - frame.camX) < 0.02) frame.camX = target;
      frame.mx += (pointer.x - frame.mx) * 0.06;
      frame.my += (pointer.y - frame.my) * 0.06;

      if (frame.camX !== lastCam || Math.abs(frame.mx - lastMx) > 0.0005) {
        lastCam = frame.camX;
        lastMx = frame.mx;
        for (const b of BANDS) {
          const el = bandEls.current[b];
          if (el) el.style.transform = `translate3d(${-frame.camX * BAND_FACTOR[b] * s + frame.mx * MOUSE_DEPTH[b]}px,${frame.my * MOUSE_DEPTH[b] * 0.4}px,0)`;
        }
        if (nearRef.current) nearRef.current.style.transform = `translate3d(${-frame.camX * s + frame.mx * MOUSE_DEPTH.near}px,0,0)`;
        if (sunRef.current) {
          const u = p;
          sunRef.current.style.transform = `translate3d(${(0.1 + u * 0.8) * dims.vw}px,${(0.16 + Math.sin(u * Math.PI) * -0.05) * dims.vh}px,0)`;
        }
        ensureSegments();
        const bucket = Math.floor(frame.camX / 250);
        if (bucket !== lastBucket) {
          lastBucket = bucket;
          setLiveBucket(bucket);
        }
      }
      const f = camera.focusAt(p);
      if (f !== lastFocus) {
        lastFocus = f;
        journey.set({ focus: f });
        document.documentElement.dataset.station = FOCUSES[f].station;
      }
      emitFrame();
    };
    gsap.ticker.add(tick);

    goTo.current = (i: number) => {
      const y = top() + camera.progressOf(i) * scrollLen;
      if (lenis) lenis.scrollTo(y, { duration: 1.9, easing: (t) => 1 - Math.pow(1 - t, 4) });
      else window.scrollTo({ top: y });
    };
    journey.goTo = (i) => goTo.current(i);

    journey.reroll = () => {
      const next = Math.floor(Math.random() * 1e6);
      window.history.replaceState(null, "", `?seed=${next}${window.location.hash}`);
      setSeed(next);
    };
    journey.download = async () => {
      // The current view as a standalone SVG (white page, like the original), every band at its own parallax offset.
      const view = vwUnits;
      const inView = metaRef.current.filter((m) => {
        const x0 = frame.camX * BAND_FACTOR[m.band];
        return m.x + m.hw * 1.15 + 80 > x0 && m.x - m.hw * 1.15 - 80 < x0 + view;
      });
      const svgs = await world.svgs(inView.map((m) => m.id));
      const body = BANDS.map(
        (b) => `<g transform="translate(${-(frame.camX * BAND_FACTOR[b]).toFixed(1)},0)">${inView.filter((m) => m.band === b).map((m) => svgs[m.id]).join("")}</g>`,
      ).join("");
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${view}" height="${WORLD_H}" viewBox="0 0 ${view} ${WORLD_H}"><rect width="100%" height="100%" fill="#fff"/>${body}</svg>`;
      const a = Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" })),
        download: `shan-shui-${seed}-${Math.round(frame.camX)}.svg`,
      });
      a.click();
      URL.revokeObjectURL(a.href);
    };

    // Keyboard focus can land on an off-screen station: bring the camera to it instead of letting overflow scroll.
    const stage = stageRef.current;
    const onFocusIn = (e: FocusEvent) => {
      if (stage) {
        stage.scrollLeft = 0;
        stage.scrollTop = 0;
      }
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-focus]");
      const id = el?.dataset.focus;
      const i = FOCUSES.findIndex((f) => f.id === id);
      if (i >= 0 && i !== lastFocus) goTo.current(i);
    };
    const near = nearRef.current;
    near?.addEventListener("focusin", onFocusIn);

    // jump to a station named in the URL hash, e.g. /#projects
    const hash = window.location.hash.slice(1);
    const hi = FOCUSES.findIndex((f) => f.station === hash);
    if (hi > 0) window.scrollTo({ top: top() + camera.progressOf(hi) * scrollLen });

    ensureSegments();
    return () => {
      alive = false;
      gsap.ticker.remove(tick);
      lenis?.destroy();
      window.removeEventListener("pointermove", onPointer);
      near?.removeEventListener("focusin", onFocusIn);
      segEls.forEach((el) => el.remove());
      world.dispose();
      worldRef.current = null;
    };
    // The world is rebuilt when the viewport scale changes; cheap (plan ~50 ms) and keeps one code path.
  }, [camera, scrollLen, s, vwUnits, dims.vw, dims.vh, dims.dpr, seed]);

  // Highlight copy of the peak the camera rests on (or the pointer is over): same strokes drawn again, darker, with a glow.
  useEffect(() => {
    const w = worldRef.current;
    if (glow < 0 || !w) return setGlowSvg(null);
    let live = true;
    w.svgs([`peak-${glow}`]).then((r) => live && setGlowSvg({ i: glow, svg: r[`peak-${glow}`] }));
    return () => void (live = false);
  }, [glow, seed, dims.vw]);

  const bandStyle = (b: Band): CSSProperties => ({ zIndex: BANDS.indexOf(b) * 2 + 2 });
  const hostRef = useCallback(
    (b: Band) => (el: HTMLDivElement | null) => {
      segHost.current[b] = el;
    },
    [],
  );

  return (
    <div ref={journeyRef} className="journey" style={{ height: scrollLen + dims.vh }}>
      <div ref={stageRef} className="stage" style={{ ["--s" as string]: s, ["--world-w" as string]: WORLD_W }}>
        <div className="sky" aria-hidden />
        <div ref={sunRef} className="sun" aria-hidden />
        <Birds />

        {BANDS.map((b) => (
          <div key={b} aria-hidden>
            <div ref={(el) => void (bandEls.current[b] = el)} className={`band band-${b}`} style={bandStyle(b)}>
              <div ref={hostRef(b)} className="band-segs" />
              {b === "near" && glowSvg && glowSvg.i === glow && (() => {
                const pk = projectPeaks[glowSvg.i];
                const hw = (pk.featured ? 235 : 170) + 50;
                return (
                  <svg
                    key={glowSvg.i}
                    className="peak-glow"
                    style={{ left: (pk.x - hw) * s, width: hw * 2 * s, height: WORLD_H * s }}
                    viewBox={`${pk.x - hw} 0 ${hw * 2} ${WORLD_H}`}
                    dangerouslySetInnerHTML={{ __html: glowSvg.svg }}
                  />
                );
              })()}
              {live
                .filter((l) => {
                  if (l.meta.band !== b) return false;
                  // only mount live entities near the viewport (keeps the DOM small)
                  const x0 = liveBucket * 250 * BAND_FACTOR[b];
                  return l.meta.x + l.meta.hw > x0 - 500 && l.meta.x - l.meta.hw < x0 + vwUnits + 900;
                })
                .map(({ meta: m, svg }) => (
                  <svg
                    key={m.id}
                    className={`live live-${m.kind}`}
                    style={{
                      left: (m.x - m.hw) * s,
                      width: m.hw * 2 * s,
                      height: WORLD_H * s,
                      transformOrigin: `50% ${(m.y / WORLD_H) * 100}%`,
                      ["--d" as string]: `${-((m.x * 0.013) % 7)}s`,
                    }}
                    viewBox={`${m.x - m.hw} 0 ${m.hw * 2} ${WORLD_H}`}
                    dangerouslySetInnerHTML={{ __html: svg }}
                  />
                ))}
            </div>
            {b === "far" && <div className="mist mist-a" style={{ zIndex: 3 }} />}
            {b === "mid" && <div className="mist mist-b" style={{ zIndex: 5 }} />}
          </div>
        ))}

        <div ref={nearRef} className="overlays" style={{ zIndex: 20 }}>
          {children}
        </div>
        <div className="vignette" aria-hidden />
      </div>
    </div>
  );
}
