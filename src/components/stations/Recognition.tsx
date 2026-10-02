"use client";
import { achievements, certifications } from "@/lib/data";
import { stationById } from "@/lib/stations";
import { At, wy } from "./At";

const X = stationById("recognition").x;

export default function Recognition() {
  return (
    <>
      <At x={X} y={wy(78)} focus="recognition" w="min(980px, 92vw)" className="rec-head">
        <p className="eyebrow">04 — 賞 Recognition</p>
        <ul className="certs mono">
          {certifications.map((c) => (
            <li key={c.name} title={c.detail}>
              <b>{c.name}</b>
              <span>{c.detail}</span>
            </li>
          ))}
        </ul>
      </At>
      {achievements.map((a, k) => (
        <At key={a.title} x={X + (k - 1) * 360} y={wy(215)} focus="recognition" w="min(250px, 74vw)" className="stele">
          <p className="mono year">{a.year}</p>
          <h3>{a.title}</h3>
          <p className="mono org">{a.org}</p>
          <p className="desc">{a.description}</p>
        </At>
      ))}
    </>
  );
}
