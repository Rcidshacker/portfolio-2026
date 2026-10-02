"use client";
import { useEffect, useMemo, useRef } from "react";
import { FOCUSES, isVisibleFocus, makeCamera } from "@/lib/camera";
import { frame, journey, onFrame, useJourney } from "@/lib/journey";
import { projects } from "@/lib/data";
import { STATIONS } from "@/lib/stations";

/** Bottom scale: a tick per stop, a red dot for the camera. Click a tick to travel there. */
export default function Ruler() {
  const ready = useJourney((s) => s.ready);
  const focus = useJourney((s) => s.focus);
  const filter = useJourney((s) => s.filter);
  const dot = useRef<HTMLSpanElement>(null);
  const ticks = useMemo(() => {
    if (!ready) return [];
    const cam = makeCamera(frame.vwUnits, window.innerWidth < 820);
    return FOCUSES.map((f, i) => ({ f, i, at: cam.progressOf(i) * 100 }));
  }, [ready]);

  useEffect(() => onFrame(() => dot.current && (dot.current.style.left = `${frame.progress * 100}%`)), []);

  const f = FOCUSES[focus];
  const label = f.project !== undefined ? projects[f.project].title : STATIONS.find((s) => s.id === f.station)!.label;
  return (
    <div className="ruler" role="group" aria-label="Journey progress">
      <p className="mono ruler-label" aria-live="polite">{label}</p>
      <div className="ruler-track">
        {ticks.filter(({ i }) => isVisibleFocus(i, filter)).map(({ f, i, at }) => (
          <button
            key={f.id}
            className={`tick${f.project === undefined ? " major" : ""}${i === focus ? " on" : ""}`}
            style={{ left: `${at}%` }}
            onClick={() => journey.goTo(i)}
            aria-label={`Go to ${f.id}`}
          />
        ))}
        <span ref={dot} className="ruler-dot" aria-hidden />
      </div>
    </div>
  );
}
