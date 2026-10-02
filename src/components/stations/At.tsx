"use client";
import type { CSSProperties, ReactNode } from "react";
import { FOCUSES } from "@/lib/camera";
import { useJourney } from "@/lib/journey";

/** Pin content to a world x (centred). `y` is any CSS length; use `wy()` for world units. */
export function At({ x, y, focus, w, className = "", style, children }: {
  x: number;
  y: string;
  focus: string;
  w?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div data-focus={focus} className={`at ${className}`} style={{ left: `calc(var(--s) * ${x}px)`, top: y, ["--w" as string]: w, ...style }}>
      {children}
    </div>
  );
}

/** World units (0..700 tall) as a CSS length that tracks the stage scale. */
export const wy = (units: number) => `calc(var(--s) * ${units}px)`;

export const useFocusId = () => useJourney((s) => FOCUSES[s.focus].id);
export const useStationId = () => useJourney((s) => FOCUSES[s.focus].station);
