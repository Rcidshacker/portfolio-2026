"use client";
import { useEffect, useRef } from "react";

interface Dab {
  x: number;
  y: number;
  r: number;
  born: number;
}
const LIFE = 1400;

/** Brush trail: dabs are emitted per distance travelled (not per frame), so a flick and a crawl draw the same ribbon. */
export default function InkTrail() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = () => {
      cv.width = innerWidth * dpr;
      cv.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    addEventListener("resize", size);

    const dabs: Dab[] = [];
    let last: { x: number; y: number; t: number } | null = null;
    let raf = 0;
    let colour = "29,26,22";
    const readColour = () => {
      const c = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim();
      const m = /^#([0-9a-f]{6})$/i.exec(c);
      if (m) colour = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)).join(",");
    };
    readColour();
    const mo = new MutationObserver(readColour);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const loop = (now: number) => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      let alive = 0;
      for (const d of dabs) {
        const k = 1 - (now - d.born) / LIFE;
        if (k <= 0) continue;
        alive++;
        ctx.fillStyle = `rgba(${colour},${(0.16 * k * k).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * (0.55 + 0.45 * k), 0, 6.283);
        ctx.fill();
      }
      while (dabs.length && now - dabs[0].born > LIFE) dabs.shift();
      raf = alive ? requestAnimationFrame(loop) : 0;
    };
    const move = (e: PointerEvent) => {
      const t = performance.now();
      if (last) {
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        const dist = Math.hypot(dx, dy);
        const speed = dist / Math.max(1, t - last.t);
        const r = Math.max(1.6, 7 - speed * 3.2); // fast strokes run thin, slow ones pool
        const steps = Math.min(40, Math.floor(dist / 3));
        for (let i = 1; i <= steps; i++) dabs.push({ x: last.x + (dx * i) / steps, y: last.y + (dy * i) / steps, r, born: t });
      }
      last = { x: e.clientX, y: e.clientY, t };
      if (!raf) raf = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move, { passive: true });
    const hide = () => (last = null);
    document.addEventListener("pointerleave", hide);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      removeEventListener("resize", size);
      document.removeEventListener("pointerleave", hide);
      mo.disconnect();
    };
  }, []);
  return <canvas ref={ref} className="ink-trail" aria-hidden />;
}
