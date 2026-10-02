"use client";
import { achievements, certifications, projects, skills } from "@/lib/data";
import { FOCUSES } from "@/lib/camera";
import { useJourney } from "@/lib/journey";
import Icon from "./Icon";

const SKILL_JP = ["智", "界", "基", "解", "言"];

/**
 * Side panels, fixed to the viewport so they always fit one screen. Whatever stop the camera is on
 * decides which panel is open; all of a station's content is visible at once, nothing needs hovering.
 */
export default function Panels() {
  const focus = useJourney((s) => s.focus);
  const f = FOCUSES[focus];
  const filter = useJourney((s) => s.filter);

  return (
    <>
      {/* Projects: one card per project, stacked in the same grid cell and cross-faded */}
      <aside className={`panel${f.station === "projects" ? " on" : ""}`} aria-label="Project details" inert={f.station !== "projects"}>
        <div className="stack-cells">
          {projects.map((p, i) => {
            const on = f.project === i;
            return (
              <article key={p.title} className={`card${on ? " on" : ""}`} aria-hidden={!on} inert={!on}>
                <header>
                  <span className="seal-mini" aria-hidden>{p.featured ? "精選" : "作"}</span>
                  <span className="mono period">{p.period}</span>
                  <span className="mono count">
                    {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                  </span>
                </header>
                <h3>{p.title}</h3>
                <p className="mono sub">{p.subtitle} · {p.category}</p>
                <p className="desc">{p.description}</p>
                {p.metrics && (
                  <ul className="chips">
                    {p.metrics.map((m) => (
                      <li key={m} className="chip seal">{m}</li>
                    ))}
                  </ul>
                )}
                <ul className="tags mono">
                  {p.stack.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                {p.github && (
                  <a className="ext mono" href={p.github} target="_blank" rel="noopener noreferrer">
                    <Icon name="github" size={15} /> View on GitHub <Icon name="arrowUpRight" size={14} />
                  </a>
                )}
              </article>
            );
          })}
        </div>
        <p className="mono panel-note" aria-live="polite">
          {filter === "All" ? "Scroll, swipe or use the arrow keys" : `Showing ${filter} projects`}
        </p>
      </aside>

      <aside className={`panel${f.station === "skills" ? " on" : ""}`} aria-label="Skills" inert={f.station !== "skills"}>
        <div className="card on">
          <p className="eyebrow">03 — 技 Skills</p>
          <h2 className="h2">Five trees, one grove.</h2>
          <dl className="skill-list">
            {Object.entries(skills).map(([name, items], k) => (
              <div key={name} className="skill-row">
                <dt>
                  <span className="seal-mini" aria-hidden>{SKILL_JP[k]}</span>
                  {name}
                </dt>
                <dd>
                  <ul className="tags mono">
                    {items.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>

      <aside className={`panel${f.station === "recognition" ? " on" : ""}`} aria-label="Recognition" inert={f.station !== "recognition"}>
        <div className="card on">
          <p className="eyebrow">04 — 賞 Recognition</p>
          <ol className="wins">
            {achievements.map((a) => (
              <li key={a.title}>
                <p className="mono year">{a.year} · {a.org}</p>
                <h3>{a.title}</h3>
                <p className="desc">{a.description}</p>
              </li>
            ))}
          </ol>
          <ul className="certs mono">
            {certifications.map((c) => (
              <li key={c.name}>
                <b>{c.name}</b>
                <span>{c.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
