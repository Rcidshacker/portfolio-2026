"use client";
import { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  w: number;
  vy: number;
  ph: number;
  rot: number;
  vr: number;
}

/** Vermilion petals drifting across the whole scroll. One small canvas loop; paused while the tab is hidden. */
export default function Petals() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    let W = 0;
    let H = 0;
    let petals: Petal[] = [];
    const size = () => {
      W = innerWidth;
      H = innerHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      petals = Array.from({ length: Math.round(Math.min(46, W / 28)) }, () => ({
        x: rnd(0, W),
        y: rnd(-H, H),
        w: rnd(3, 7),
        vy: rnd(0.35, 0.95),
        ph: rnd(0, 6.28),
        rot: rnd(0, 6.28),
        vr: rnd(-0.02, 0.02),
      }));
    };
    size();

    let seal = "#b4161f";
    const readSeal = () => (seal = getComputedStyle(document.documentElement).getPropertyValue("--seal").trim() || seal);
    readSeal();
    const mo = new MutationObserver(readSeal);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    let raf = 0;
    let t = 0;
    let prev = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      // speeds are tuned per 60 Hz frame; scale by real elapsed time so 144 Hz screens don't fall faster
      const k = Math.min((now - prev) / 16.67, 4);
      prev = now;
      t += 0.016 * k;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = seal;
      ctx.globalAlpha = 0.5;
      for (const p of petals) {
        p.y += p.vy * k;
        p.x += (Math.sin(t * 0.9 + p.ph) * 0.55 + 0.25) * k;
        p.rot += p.vr * k;
        if (p.y > H + 10) {
          p.y = -10;
          p.x = rnd(0, W);
        }
        if (p.x > W + 10) p.x = -10;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.w, p.w * 0.5, p.rot, 0, 6.283);
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(loop);
    const onVis = () => {
      cancelAnimationFrame(raf);
      prev = performance.now();
      if (!document.hidden) raf = requestAnimationFrame(loop);
    };
    let rt: ReturnType<typeof setTimeout>;
    const onResize = () => (clearTimeout(rt), (rt = setTimeout(size, 150)));
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(rt);
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="petals" aria-hidden />;
}
