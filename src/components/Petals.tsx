"use client";
import { useEffect, useRef } from "react";
import { useStationId } from "./stations/At";

interface Petal {
  x: number;
  y: number;
  w: number;
  vy: number;
  ph: number;
  rot: number;
  vr: number;
}

/** Drifting petals over the skills grove. The loop only runs while that station is on screen. */
export default function Petals() {
  const on = useStationId() === "skills";
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!on || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = innerWidth;
    const H = innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const css = getComputedStyle(document.documentElement);
    const seal = css.getPropertyValue("--seal").trim() || "#b4161f";
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const petals: Petal[] = Array.from({ length: Math.round(Math.min(46, W / 28)) }, () => ({
      x: rnd(0, W),
      y: rnd(-H, H),
      w: rnd(3, 7),
      vy: rnd(0.35, 0.95),
      ph: rnd(0, 6.28),
      rot: rnd(0, 6.28),
      vr: rnd(-0.02, 0.02),
    }));

    let raf = 0;
    let t = 0;
    const loop = () => {
      t += 0.016;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = seal;
      for (const p of petals) {
        p.y += p.vy;
        p.x += Math.sin(t * 0.9 + p.ph) * 0.55 + 0.25;
        p.rot += p.vr;
        if (p.y > H + 10) {
          p.y = -10;
          p.x = rnd(0, W);
        }
        if (p.x > W + 10) p.x = -10;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.w, p.w * 0.5, p.rot, 0, 6.283);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      ctx.clearRect(0, 0, W, H);
    };
  }, [on]);

  return <canvas ref={ref} className={`petals${on ? " on" : ""}`} aria-hidden />;
}
