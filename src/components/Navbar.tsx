"use client";
import { useState } from "react";
import { FOCUSES } from "@/lib/camera";
import { journey } from "@/lib/journey";
import { personalInfo } from "@/lib/data";
import { STATIONS } from "@/lib/stations";
import { useStationId } from "./stations/At";
import Icon from "./Icon";
import ThemeToggle from "./ThemeToggle";

const first = (station: string) => FOCUSES.findIndex((f) => f.station === station);

export default function Navbar() {
  const active = useStationId();
  const [open, setOpen] = useState(false);
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    journey.goTo(first(id));
  };
  return (
    <header className="nav">
      <a href="#hero" className="brand" onClick={go("hero")} aria-label="Back to start">
        <span className="seal-mini" aria-hidden>ル</span>
        <span className="brand-name">{personalInfo.name}</span>
      </a>
      <nav aria-label="Journey" className={`nav-links${open ? " open" : ""}`}>
        {STATIONS.filter((s) => s.id !== "hero").map((s) => (
          <a key={s.id} href={`#${s.id}`} onClick={go(s.id)} aria-current={active === s.id ? "step" : undefined} className="mono">
            <i aria-hidden>{s.jp}</i> {s.label}
          </a>
        ))}
      </nav>
      <div className="nav-tools">
        <ThemeToggle />
        <button className="menu-btn" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(!open)}>
          <Icon name={open ? "close" : "menu"} size={17} />
        </button>
      </div>
    </header>
  );
}
