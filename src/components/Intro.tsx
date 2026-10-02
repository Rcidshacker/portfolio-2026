"use client";
import { useEffect, useState } from "react";
import { useJourney } from "@/lib/journey";

/** Ink-grinding loader: an enso draws itself while the worker bakes the first screen of painting. */
export default function Intro() {
  const ready = useJourney((s) => s.ready);
  const [minDone, setMinDone] = useState(false);
  const [gone, setGone] = useState(false);
  const show = !(ready && minDone);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setMinDone(true), reduced ? 0 : 900);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (show) return;
    document.documentElement.dataset.ready = "1";
    const t = setTimeout(() => setGone(true), 900);
    return () => clearTimeout(t);
  }, [show]);

  if (gone) return null;
  return (
    <div className={`intro${show ? "" : " out"}`} aria-hidden={!show} role="status">
      <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden>
        <circle className="enso" cx="60" cy="60" r="44" />
      </svg>
      <p className="mono">山水 · loading the scroll</p>
    </div>
  );
}
