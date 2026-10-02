/** A loose flock crossing the sky. Pure CSS (compositor transforms), so it costs nothing per frame in JS. */
export default function Birds() {
  return (
    <div className="birds" aria-hidden>
      {Array.from({ length: 7 }, (_, i) => (
        <svg key={i} className="bird" style={{ ["--i" as string]: i }} viewBox="0 0 16 8">
          <path d="M0 4 Q4 0 8 4 Q12 0 16 4" />
        </svg>
      ))}
    </div>
  );
}
