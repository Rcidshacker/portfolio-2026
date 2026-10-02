"use client";
import { projects } from "@/lib/data";
import { FOCUSES } from "@/lib/camera";
import { journey, useJourney } from "@/lib/journey";
import { useStationId } from "./stations/At";

const CATS = ["All", "AI/ML", "SaaS", "Tooling", "CV", "Full-Stack"];

/** Picking a category also travels to its first project, so the click always shows something. */
function pick(cat: string) {
  journey.set({ filter: cat });
  if (cat === "All") return;
  const here = FOCUSES[journey.get().focus].project;
  if (here !== undefined && projects[here].category === cat) return; // already on a matching project
  const to = FOCUSES.findIndex((f) => f.project !== undefined && projects[f.project].category === cat);
  if (to >= 0) journey.goTo(to);
}

export default function FilterBar() {
  const filter = useJourney((s) => s.filter);
  const on = useStationId() === "projects";
  return (
    <div className={`filters${on ? " show" : ""}`} role="group" aria-label="Filter projects" inert={!on}>
      {CATS.map((c) => (
        <button key={c} className="mono" aria-pressed={filter === c} onClick={() => pick(c)}>
          {c}
        </button>
      ))}
    </div>
  );
}
