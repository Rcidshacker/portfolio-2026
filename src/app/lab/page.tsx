"use client";
// Dev-only lab: eyeball the baked world pipeline. Not part of the product (renders nothing in production).
import { useEffect, useRef, useState } from "react";
import { createWorld, type WorldClient } from "@/lib/shanshui/client";
import { PAD, SEG, type Baked } from "@/lib/shanshui/core";
import { BANDS, BAND_FACTOR, type Band, type EntityMeta, type Quality } from "@/lib/shanshui/world";
import { VW_MAX, WORLD_H, WORLD_W } from "@/lib/stations";

function Seg({ bmp, scale }: { bmp: Baked; scale: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    c.width = bmp.width;
    c.height = bmp.height;
    c.getContext("2d")!.drawImage(bmp, 0, 0);
  }, [bmp]);
  return <canvas ref={ref} style={{ width: (SEG + 2 * PAD) * scale, height: WORLD_H * scale, display: "block", flex: "none" }} />;
}

export default function Lab() {
  const [seed, setSeed] = useState(7);
  const [quality, setQuality] = useState<Quality>(2);
  const [cam, setCam] = useState(0);
  const [scale, setScale] = useState(0.5);
  const [off, setOff] = useState<Record<Band, boolean>>({ far: false, mid: false, near: false, front: false });
  const [meta, setMeta] = useState<EntityMeta[]>([]);
  const [svgs, setSvgs] = useState<Record<string, string>>({});
  const [, force] = useState(0);
  const [stat, setStat] = useState("");
  const world = useRef<WorldClient | null>(null);
  const baked = useRef(new Map<string, Baked>());
  const asked = useRef(new Set<string>());

  useEffect(() => {
    const t0 = performance.now();
    baked.current.clear();
    asked.current.clear();
    const w = createWorld(seed, quality);
    world.current = w;
    w.meta.then((m) => {
      setMeta(m);
      setStat(`plan ${m.length} entities in ${Math.round(performance.now() - t0)} ms`);
      w.svgs(m.filter((e) => e.live).map((e) => e.id)).then(setSvgs);
    });
    return () => w.dispose();
  }, [seed, quality]);

  const px = scale * 1.5; // bake resolution: canvas px per world unit
  useEffect(() => {
    const w = world.current;
    if (!w || !meta.length) return;
    for (const b of BANDS) {
      const x0 = cam * BAND_FACTOR[b];
      for (let s = Math.floor(x0 / SEG); s <= Math.floor((x0 + VW_MAX) / SEG); s++) {
        const k = `${b}:${s}:${px}:${seed}:${quality}`;
        if (asked.current.has(k)) continue;
        asked.current.add(k);
        const t0 = performance.now();
        w.bake(b, s, px).then((bm) => {
          baked.current.set(k, bm);
          setStat((v) => `${v.split(" · ")[0]} · last bake ${b}#${s} ${Math.round(performance.now() - t0)} ms`);
          force((n) => n + 1);
        });
      }
    }
  }, [cam, meta, px, seed, quality]);

  if (process.env.NODE_ENV === "production") return null;
  return (
    <div style={{ background: "#efe6d0", minHeight: "100vh", color: "#222", fontFamily: "monospace", fontSize: 12 }}>
      <div style={{ padding: 8, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        seed <input value={seed} onChange={(e) => setSeed(+e.target.value || 0)} style={{ width: 70 }} />
        q <select value={quality} onChange={(e) => setQuality(+e.target.value as Quality)}>{[1, 2, 3].map((q) => <option key={q}>{q}</option>)}</select>
        scale <input type="range" min={0.2} max={1} step={0.05} value={scale} onChange={(e) => setScale(+e.target.value)} />
        {BANDS.map((b) => (
          <label key={b}><input type="checkbox" checked={!off[b]} onChange={() => setOff({ ...off, [b]: !off[b] })} />{b}</label>
        ))}
        <span id="stat">{stat}</span>
        <input type="range" min={0} max={WORLD_W - VW_MAX} value={cam} onChange={(e) => setCam(+e.target.value)} style={{ width: "40vw" }} /> cam {cam}
      </div>
      <div style={{ position: "relative", width: VW_MAX * scale, height: WORLD_H * scale, margin: "8px auto", overflow: "hidden", outline: "1px solid #0003" }}>
        {BANDS.map((b) => {
          if (off[b]) return null;
          const x0 = cam * BAND_FACTOR[b];
          const first = Math.floor(x0 / SEG);
          const last = Math.floor((x0 + VW_MAX) / SEG);
          const segs = [];
          for (let s = first; s <= last; s++) {
            const bm = baked.current.get(`${b}:${s}:${px}:${seed}:${quality}`);
            if (bm) segs.push(<div key={s} style={{ position: "absolute", left: (s * SEG - PAD) * scale }}><Seg bmp={bm} scale={scale} /></div>);
          }
          const live = meta.filter((e) => e.band === b && e.live && e.x > x0 - 400 && e.x < x0 + VW_MAX + 400 && svgs[e.id]);
          return (
            <div key={b} style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", transform: `translateX(${-x0 * scale}px)` }}>
              {segs}
              <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={WORLD_H * scale} viewBox={`0 0 ${1 / scale} ${WORLD_H}`}
                dangerouslySetInnerHTML={{ __html: live.map((e) => svgs[e.id]).join("") }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
