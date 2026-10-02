"use client";
import { journey, useJourney } from "@/lib/journey";
import { useStationId } from "./stations/At";

const CATS = ["All", "AI/ML", "SaaS", "Tooling", "CV", "Full-Stack"];

export default function FilterBar() {
  const filter = useJourney((s) => s.filter);
  const on = useStationId() === "projects";
  return (
    <div className={`filters${on ? " show" : ""}`} role="group" aria-label="Filter projects" inert={!on}>
      {CATS.map((c) => (
        <button key={c} className="mono" aria-pressed={filter === c} onClick={() => journey.set({ filter: c })}>
          {c}
        </button>
      ))}
    </div>
  );
}
