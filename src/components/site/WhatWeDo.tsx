import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSectionReveal } from "@/hooks/useReveal";
import { prefersReducedMotion } from "@/lib/motion";
import { MiniCrestIcon } from "./MiniCrestIcon";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    n: "01",
    title: "Website design & build",
    body: "Editorial, hand-crafted sites that make a restaurant look the way it tastes. Fast, mobile-first, engineered to sell tables and covers, not to win awards for animation.",
    icon: "point" as const,
  },
  {
    n: "02",
    title: "Order management",
    body: "Take orders on your own domain, in your own brand, without paying 30% commission to a delivery marketplace. Kitchen-ready ticketing, WhatsApp confirmations, receipts.",
    icon: "gem" as const,
  },
  {
    n: "03",
    title: "Booking & automation",
    body: "Reservations, waitlist, deposits, table maps, reminders. Quiet automation that runs in the background so your host stand is never on hold with a caller.",
    icon: "ring" as const,
  },
];

export function WhatWeDo() {
  const ref = useSectionReveal<HTMLElement>();
  const lineRef = useRef<SVGPathElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useGSAP(
    () => {
      if (!lineRef.current) return;
      const length = lineRef.current.getTotalLength();
      if (prefersReducedMotion()) {
        gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: 0 });
        return;
      }
      gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(lineRef.current, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 65%",
        },
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="services"
      className="relative z-[1] overflow-hidden bg-[#050505] border-t border-[color:var(--border)] px-6 py-32 md:px-14 md:py-48"
    >
      {/* Subtle background glow behind the card row — CSS only, no extra canvas */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, rgba(207,170,92,0.14), rgba(207,170,92,0) 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px]">
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

        <p data-reveal className="mb-10 max-w-2xl text-[15px] leading-relaxed text-ink/60">
          We started with restaurants and cafés — the same demo-first approach works for any
          local business with a strong social presence and no real website.
        </p>

        {/* Connective thread behind the card row, draws itself in on scroll */}
        <svg
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-[172px] hidden h-2 w-full md:block"
          viewBox="0 0 1200 4"
          preserveAspectRatio="none"
        >
          <path
            ref={lineRef}
            d="M0,2 L1200,2"
            stroke="var(--gold)"
            strokeOpacity="0.35"
            strokeWidth="1"
            fill="none"
          />
        </svg>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((c, i) => (
            <article
              key={c.n}
              data-reveal
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard((v) => (v === i ? null : v))}
              onFocus={() => setHoveredCard(i)}
              onBlur={() => setHoveredCard((v) => (v === i ? null : v))}
              className="group relative flex flex-col justify-between border border-[color:var(--border)] bg-[#0a0a0a] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-gold hover:shadow-[0_0_60px_-20px_rgba(207,170,92,0.55)] md:p-10 md:min-h-[380px]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-[11px] tracking-[0.32em] text-gold">{c.n}</span>
                  <div className="h-[52px] w-[52px] opacity-80 transition-opacity duration-500 group-hover:opacity-100">
                    <MiniCrestIcon shape={c.icon} hovered={hoveredCard === i} />
                  </div>
                </div>
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
