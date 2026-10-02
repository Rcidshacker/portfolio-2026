"use client";
import { projects } from "@/lib/data";
import { FOCUSES, isVisibleFocus } from "@/lib/camera";
import { projectPeaks } from "@/lib/stations";
import { journey, useJourney } from "@/lib/journey";
import { At, wy } from "./At";

/** A small tag above each peak. Click one to travel there; the one the camera rests on lights up. */
export default function Peaks() {
  const filter = useJourney((s) => s.filter);
  const focus = useJourney((s) => s.focus);
  return (
    <>
      {projectPeaks.map((pk) => {
        const idx = FOCUSES.findIndex((f) => f.project === pk.index);
        const shown = isVisibleFocus(idx, filter);
        const current = focus === idx;
        return (
          <At key={pk.title} x={pk.x} y={wy(585 - (pk.featured ? 360 : 240) * 0.75 - 50)} focus={`project-${pk.index}`} className={`peak-tag${current ? " on" : ""}${shown ? "" : " dim"}`}>
            <button
              onClick={() => journey.goTo(idx)}
              onPointerEnter={() => journey.set({ hover: pk.index })}
              onPointerLeave={() => journey.set({ hover: -1 })}
              tabIndex={shown ? 0 : -1}
              aria-label={`${projects[pk.index].title}: ${projects[pk.index].subtitle}`}
            >
              <span className="n mono">{String(pk.index + 1).padStart(2, "0")}</span>
              <span className="t">{pk.title}</span>
            </button>
          </At>
        );
      })}
    </>
  );
}
