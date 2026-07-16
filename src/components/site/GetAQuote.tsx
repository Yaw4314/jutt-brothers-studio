import { useSectionReveal } from "@/hooks/useReveal";

export function GetAQuote() {
  const ref = useSectionReveal<HTMLElement>();
  return (
    <section
      ref={ref}
      id="quote"
      className="border-t border-[color:var(--border)] px-6 py-32 md:px-14 md:py-48"
    >
      <div className="mx-auto max-w-[1000px] text-center">
        <p data-reveal className="mb-6 font-sans text-[11px] uppercase tracking-[0.32em] text-gold">
          Pricing
        </p>
        <h2 data-reveal className="font-display text-[clamp(2.2rem,5.2vw,4.2rem)] leading-[1.05] text-ink">
          We don&rsquo;t publish prices.<br />We publish demos.
        </h2>
        <p data-reveal className="mx-auto mt-8 max-w-[620px] font-tagline text-lg text-ink/75 md:text-xl">
          Every restaurant is different. Every kitchen has a different tempo, a different guest, a
          different way of doing hospitality. We&rsquo;d rather show you what your site could look
          like than argue over a package on a landing page.
        </p>
        <div data-reveal className="mt-12">
          <a
            href="https://ig.me/m/jutt.brothers.dev"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 border border-gold px-9 py-4 text-[12px] uppercase tracking-[0.28em] text-gold transition-all hover:bg-gold hover:text-[#050505]"
          >
            Ask for your free demo &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
