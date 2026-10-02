"use client";
import { useState } from "react";
import { skills } from "@/lib/data";
import { stationById } from "@/lib/stations";
import { At, wy } from "./At";

const X = stationById("skills").x;
/** Tree heights from world.ts, so each label hangs just above its tree. */
const TREE_TOP = [450, 520, 380, 490, 510];
const JP = ["智", "界", "基", "解", "言"];

export default function Skills() {
  const cats = Object.entries(skills);
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <At x={X} y="clamp(76px, 11svh, 130px)" focus="skills" w="min(560px, 88vw)" className="skills-head">
        <p className="eyebrow">03 — 技 Skills</p>
        <h2 className="h2">Five trees, one grove.</h2>
      </At>
      {cats.map(([name, items], k) => {
        const x = X + (k - 2) * 340;
        const isOpen = open === k;
        return (
          <At key={name} x={x} y={wy(TREE_TOP[k] - (isOpen ? 230 : 120))} focus={`skills`} w="min(250px, 70vw)" className={`plaque skill${isOpen ? " open" : ""}`}>
            <button
              className="skill-btn"
              aria-expanded={isOpen}
              onPointerEnter={() => setOpen(k)}
              onPointerLeave={() => setOpen(null)}
              onFocus={() => setOpen(k)}
              onBlur={() => setOpen(null)}
              onClick={() => setOpen(isOpen ? null : k)}
            >
              <span className="seal-mini" aria-hidden>{JP[k]}</span>
              <span className="skill-name">{name}</span>
              <span className="mono count">{items.length}</span>
            </button>
            <div className="more">
              <div>
                <ul className="stack mono">{items.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            </div>
          </At>
        );
      })}
    </>
  );
}
