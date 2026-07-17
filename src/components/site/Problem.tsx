import { useSectionReveal } from "@/hooks/useReveal";

export function Problem() {
  const ref = useSectionReveal<HTMLElement>();
  return (
    <section ref={ref} id="problem" className="relative z-[1] bg-[#050505] border-t border-[color:var(--border)] px-6 py-32 md:px-14 md:py-48">
      <div className="mx-auto max-w-[1200px]">
        <p data-reveal className="mb-14 font-sans text-[11px] uppercase tracking-[0.32em] text-gold">
          The problem
        </p>
        <h2 className="font-display text-[clamp(2rem,5.4vw,4.4rem)] leading-[1.08] tracking-[0.01em] text-ink">
          <span data-reveal className="block">Fifty thousand followers.</span>
          <span data-reveal className="block text-ink/70">No way to book a table.</span>
          <span data-reveal className="block text-ink/50">No way to place an order.</span>
          <span data-reveal className="block mt-8">Every scroll on Instagram</span>
          <span data-reveal className="block text-gold">leaks straight to a delivery app that owns your customer.</span>
        </h2>
      </div>
    </section>
  );
}
