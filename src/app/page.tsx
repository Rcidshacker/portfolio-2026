import Stage from "@/components/Stage";
import { STATIONS, projectPeaks } from "@/lib/stations";

// Temporary placeholder content while the stage is being brought up.
export default function Home() {
  return (
    <main>
      <Stage>
        {STATIONS.map((st) => (
          <div key={st.id} data-focus={st.id} style={{ position: "absolute", left: `calc(var(--s) * ${st.x}px)`, top: "12%", transform: "translateX(-50%)", fontSize: 40, fontFamily: "var(--font-mincho)", whiteSpace: "nowrap" }}>
            {st.jp} {st.label}
          </div>
        ))}
        {projectPeaks.map((p) => (
          <div key={p.title} style={{ position: "absolute", left: `calc(var(--s) * ${p.x}px)`, top: "26%", transform: "translateX(-50%)", fontSize: 16 }}>{p.title}</div>
        ))}
      </Stage>
    </main>
  );
}
