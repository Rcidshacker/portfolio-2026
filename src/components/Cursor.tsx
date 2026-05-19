"use client";
import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const onEnter = (e: Event) => {
      if ((e.target as Element).closest("a,button,[role=button]")) setHovering(true);
    };
    const onLeave = (e: Event) => {
      if ((e.target as Element).closest("a,button,[role=button]")) setHovering(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);

    const loop = () => {
      // Dot snaps fast
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      }
      // Ring follows with lerp
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        const size = hovering ? 36 : clicking ? 16 : 28;
        ringRef.current.style.transform = `translate(${ring.current.x - size / 2}px, ${ring.current.y - size / 2}px)`;
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${size}px`;
        ringRef.current.style.opacity = hovering ? "0.9" : "0.45";
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [hovering, clicking]);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full w-2 h-2 transition-transform duration-0"
        style={{
          background: clicking ? "var(--paper)" : "var(--crimson)",
          boxShadow: clicking ? "none" : "0 0 6px var(--crimson)",
          transition: "background 0.15s, box-shadow 0.15s",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9997] pointer-events-none rounded-full border"
        style={{
          borderColor: hovering ? "var(--crimson)" : "rgba(191,10,42,0.5)",
          background: hovering ? "var(--crimson-dim)" : "transparent",
          transition: "width 0.2s ease, height 0.2s ease, border-color 0.2s, background 0.2s, opacity 0.2s",
        }}
      />
    </>
  );
}
