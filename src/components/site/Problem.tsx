import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { PROBLEM_LINES, ProblemShards } from "./ProblemShards";

export function Problem() {
  const [reduced, setReduced] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    setMounted(true);
  }, []);

  const showShards = mounted && !reduced;

  return (
    <section
      id="problem"
      className="relative z-[1] min-h-[100svh] overflow-hidden border-t border-[color:var(--border)] bg-[#050505] px-6 py-32 md:px-14 md:py-48"
    >
      {showShards && (
        <div className="absolute inset-0 z-0" aria-hidden>
          <ProblemShards />
        </div>
      )}

      <div className="relative z-[1] mx-auto flex min-h-[70svh] max-w-[1200px] flex-col justify-center">
        <p className="mb-14 font-sans text-[11px] uppercase tracking-[0.32em] text-gold">
          The problem
        </p>
        {/* DOM twin of the WebGL headline: hidden from sight while the shard
            scene renders, but always present for a11y, selection and indexing. */}
        <h2
          className={
            showShards
              ? "sr-only"
              : "font-display text-[clamp(2rem,5.4vw,4.4rem)] leading-[1.08] tracking-[0.01em] text-ink"
          }
        >
          {PROBLEM_LINES.map((line, i) => (
            <span
              key={line.text}
              className="block"
              style={showShards ? undefined : { color: line.color }}
            >
              {line.text}
              {i < PROBLEM_LINES.length - 1 ? " " : ""}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
