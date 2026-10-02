"use client";
import { personalInfo } from "@/lib/data";
import { stationById } from "@/lib/stations";
import { journey } from "@/lib/journey";
import { At } from "./At";

const SEALS = [
  { jp: "頂点三", en: "Top 3 IIT Bombay" },
  { jp: "六診療所", en: "6 Clinics" },
  { jp: "特許", en: "Patent Filed" },
  { jp: "四十八時間", en: "48h Sprints" },
];

export default function Hero() {
  return (
    <At x={stationById("hero").x} y="clamp(76px, 12svh, 150px)" focus="hero" w="min(780px, 90vw)" className="hero">
      <p className="eyebrow reveal" style={{ ["--i" as string]: 0 }}>
        <i className="dot" /> AI Engineer · Vibe Coder · Open to roles
      </p>
      <p className="kana mono reveal" style={{ ["--i" as string]: 1 }}>ルーチット・ダス</p>
      <h1 className="hero-name">
        <span className="mask"><span className="rise" style={{ ["--i" as string]: 2 }}>Ruchit</span></span>
        <span className="mask accent"><span className="rise" style={{ ["--i" as string]: 3 }}>Das.</span></span>
      </h1>
      <p className="tagline reveal" style={{ ["--i" as string]: 4 }}>{personalInfo.tagline}</p>
      <p className="stackline mono reveal" style={{ ["--i" as string]: 5 }}>MCP · LangGraph · RAG · FastAPI · Next.js · pgvector</p>
      <ul className="seals reveal" style={{ ["--i" as string]: 6 }}>
        {SEALS.map((m) => (
          <li key={m.en} className="seal">
            <span className="jp">{m.jp}</span>
            <span className="en">{m.en}</span>
          </li>
        ))}
      </ul>
      <button className="begin reveal" style={{ ["--i" as string]: 7 }} onClick={() => journey.goTo(1)}>
        Begin the journey <span aria-hidden>→</span>
      </button>
    </At>
  );
}
