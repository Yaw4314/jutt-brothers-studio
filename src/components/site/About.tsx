import { useSectionReveal } from "@/hooks/useReveal";

export function About() {
  const ref = useSectionReveal<HTMLElement>();
  return (
    <section
      ref={ref}
      id="about"
      className="border-t border-[color:var(--border)] px-6 py-32 md:px-14 md:py-48"
    >
      <div className="mx-auto grid max-w-[1200px] gap-16 md:grid-cols-[1fr_1.4fr] md:gap-24">
        <div>
          <p data-reveal className="mb-6 font-sans text-[11px] uppercase tracking-[0.32em] text-gold">
            The studio
          </p>
          <h2 data-reveal className="font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] text-ink">
            Two brothers,<br />one workshop.
          </h2>
        </div>
        <div className="space-y-6 font-sans text-[15px] leading-[1.85] text-ink/80 md:text-base">
          <p data-reveal>
            Jutt Brothers is a small design and engineering studio based in Rawalpindi. We work
            almost exclusively with independent restaurants, cafes, and rooftops across Islamabad
            and the twin cities.
          </p>
          <p data-reveal>
            We started because the hospitality scene here was outgrowing what the local web could
            do for it. Restaurants with sharp branding on Instagram and rooms full of guests were
            still stuck on flat, template-driven websites &mdash; if they had one at all.
          </p>
          <p data-reveal>
            Every project is treated like a room in our own house: cared for, quiet, permanent.
            We build websites, ordering flows, and booking tools; and we keep them running long
            after launch.
          </p>
        </div>
      </div>
    </section>
  );
}
