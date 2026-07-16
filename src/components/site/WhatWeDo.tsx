import { useSectionReveal } from "@/hooks/useReveal";

const cards = [
  {
    n: "01",
    title: "Website design & build",
    body: "Editorial, hand-crafted sites that make a restaurant look the way it tastes. Fast, mobile-first, engineered to sell tables and covers, not to win awards for animation.",
  },
  {
    n: "02",
    title: "Order management",
    body: "Take orders on your own domain, in your own brand, without paying 30% commission to a delivery marketplace. Kitchen-ready ticketing, WhatsApp confirmations, receipts.",
  },
  {
    n: "03",
    title: "Booking & automation",
    body: "Reservations, waitlist, deposits, table maps, reminders. Quiet automation that runs in the background so your host stand is never on hold with a caller.",
  },
];

export function WhatWeDo() {
  const ref = useSectionReveal<HTMLElement>();
  return (
    <section ref={ref} id="services" className="border-t border-[color:var(--border)] px-6 py-32 md:px-14 md:py-48">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-reveal className="mb-5 font-sans text-[11px] uppercase tracking-[0.32em] text-gold">
              What we do
            </p>
            <h2 data-reveal className="font-display text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.05] text-ink">
              Three products.<br />One thing to sell: yours.
            </h2>
          </div>
          <p data-reveal className="max-w-md font-tagline text-lg text-ink/70">
            Built specifically for independent restaurants and cafes.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <article
              key={c.n}
              data-reveal
              className="group relative flex flex-col justify-between border border-[color:var(--border)] bg-[#0a0a0a] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-gold hover:shadow-[0_0_60px_-20px_rgba(207,170,92,0.55)] md:p-10 md:min-h-[380px]"
            >
              <div>
                <span className="font-display text-[11px] tracking-[0.32em] text-gold">{c.n}</span>
                <h3 className="mt-6 font-display text-2xl text-ink transition-colors group-hover:text-gold md:text-3xl">
                  {c.title}
                </h3>
                <p className="mt-5 text-[15px] leading-relaxed text-ink/70">{c.body}</p>
              </div>
              <span className="mt-10 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-ink-dim transition-colors group-hover:text-gold">
                Learn more <span>&rarr;</span>
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
