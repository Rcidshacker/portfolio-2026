"use client";
import { useEffect, useRef } from "react";
import { personalInfo } from "@/lib/data";
import { stationById } from "@/lib/stations";
import { frame, onFrame } from "@/lib/journey";
import { At } from "./At";

const X = stationById("about").x;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Words light up as the camera approaches, like an inscription being read aloud. */
export default function About() {
  const root = useRef<HTMLDivElement>(null);
  const paras = personalInfo.about.map((p) => p.split(" "));
  const total = paras.reduce((n, p) => n + p.length, 0);

  useEffect(() => {
    const words = Array.from(root.current?.querySelectorAll<HTMLElement>("[data-w]") ?? []);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const last = new Float32Array(words.length).fill(-1);
    return onFrame(() => {
      const centre = frame.camX + frame.vwUnits / 2;
      const t = reduced ? 1 : clamp(1 - (Math.abs(centre - X) - 120) / 900, 0, 1);
      const lead = t * (total + 10);
      for (let i = 0; i < words.length; i++) {
        const o = 0.13 + 0.87 * clamp((lead - i) / 10, 0, 1);
        if (Math.abs(o - last[i]) > 0.02) {
          last[i] = o;
          words[i].style.opacity = String(o);
        }
      }
    });
  }, [total]);

  let n = 0;
  return (
    <At x={X} y="clamp(84px, 13svh, 160px)" focus="about" w="min(700px, 88vw)" className="about">
      <p className="eyebrow">01 — 人 About</p>
      <div ref={root} className="inscription">
        <span className="tategaki kana-side" aria-hidden>人工知能 · 創造と革新</span>
        {paras.map((words, pi) => (
          <p key={pi}>
            {words.map((w, wi) => (
              <span key={wi} data-w={n++} className="w" style={{ opacity: 0.13 }}>{w}{" "}</span>
            ))}
          </p>
        ))}
        <p className="signed mono">— {personalInfo.name}, {personalInfo.location}</p>
      </div>
    </At>
  );
}
