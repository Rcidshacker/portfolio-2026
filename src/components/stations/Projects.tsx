"use client";
import { useState } from "react";
import { projects } from "@/lib/data";
import { projectPeaks } from "@/lib/stations";
import { journey, useJourney } from "@/lib/journey";
import { At, useFocusId, wy } from "./At";

/** One plaque per peak. The peak the camera rests on opens by itself; hover/focus opens any other. */
export default function Projects() {
  const focusId = useFocusId();
  const filter = useJourney((s) => s.filter);
  const [hover, setHoverState] = useState<number | null>(null);
  const setHover = (i: number | null) => {
    setHoverState(i);
    journey.set({ hover: i ?? -1 });
  };

  return (
    <>
      {projectPeaks.map((pk) => {
        const p = projects[pk.index];
        const match = filter === "All" || p.category === filter;
        const open = match && (focusId === `project-${pk.index}` || hover === pk.index);
        return (
          <At
            key={p.title}
            x={pk.x}
            y={wy(96)}
            focus={`project-${pk.index}`}
            w="min(330px, 82vw)"
            className={`plaque${open ? " open" : ""}${match ? "" : " dim"}`}
            style={{ ["--lift" as string]: pk.featured ? "0px" : "34px", ["--wo" as string]: "min(430px, 90vw)" }}
          >
            <article
              onPointerEnter={() => setHover(pk.index)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(pk.index)}
              onBlur={() => setHover(null)}
              aria-label={p.title}
            >
              <header>
                <span className="seal-mini" aria-hidden>{pk.featured ? "精選" : "作"}</span>
                <span className="mono period">{p.period}</span>
              </header>
              <h3>{p.title}</h3>
              <p className="mono sub">{p.subtitle}</p>
              <div className="more">
                <div>
                  <p className="desc">{p.description}</p>
                  {p.metrics && (
                    <ul className="chips">
                      {p.metrics.map((m) => <li key={m} className="chip seal">{m}</li>)}
                    </ul>
                  )}
                  <ul className="stack mono">
                    {p.stack.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                  {p.github && (
                    <a className="ext mono" href={p.github} target="_blank" rel="noopener noreferrer" tabIndex={match ? 0 : -1}>
                      GitHub ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          </At>
        );
      })}
    </>
  );
}
