"use client";
import { journey, useJourney } from "@/lib/journey";

/** Bottom-right: this painting's seed, a new one, or take the current view home as SVG. */
export default function Tools() {
  const seed = useJourney((s) => s.seed);
  return (
    <div className="tools mono">
      <span className="seed">seed {seed}</span>
      <button onClick={() => journey.reroll()} aria-label="Paint a new world">new seed</button>
      <button onClick={() => journey.download()} aria-label="Download this view as SVG">save svg</button>
    </div>
  );
}
