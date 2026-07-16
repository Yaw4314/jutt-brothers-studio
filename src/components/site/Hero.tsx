import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Crest3D } from "./Crest3D";
import { prefersReducedMotion } from "@/lib/motion";

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.8, delay: 0.2 })
        .from(".hero-title span", { y: 40, opacity: 0, duration: 1, stagger: 0.08 }, "-=0.5")
        .from(".hero-tagline", { y: 20, opacity: 0, duration: 0.9 }, "-=0.5")
        .from(".hero-cta", { y: 16, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(".hero-cue", { opacity: 0, duration: 0.6 }, "-=0.3");
    },
    { scope: rootRef },
  );

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative h-[100svh] w-full overflow-hidden bg-[#050505]"
    >
      <div className="absolute inset-0">
        <Crest3D />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 md:px-14 md:pb-24">
        <p className="hero-eyebrow font-sans text-[11px] uppercase tracking-[0.32em] text-gold">
          Rawalpindi &middot; Hospitality web design
        </p>
        <h1 className="hero-title mt-5 font-display text-[clamp(2.4rem,6.5vw,5.5rem)] leading-[1.02] tracking-[0.02em] text-ink">
          <span className="block">The house of</span>
          <span className="block">Jutt Brothers.</span>
        </h1>
        <p className="hero-tagline mt-6 max-w-xl font-tagline text-[clamp(1.05rem,1.6vw,1.5rem)] text-ink/85">
          We build your restaurant&rsquo;s website &mdash; before you even say yes.
        </p>
        <div className="hero-cta mt-10 flex flex-wrap items-center gap-5">
          <a
            href="https://ig.me/m/jutt.brothers.dev"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 bg-gold px-7 py-4 text-[12px] uppercase tracking-[0.28em] text-[#050505] transition-all hover:bg-[#e0be74]"
          >
            Message us on Instagram
            <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
          </a>
          <a
            href="#work"
            className="text-[12px] uppercase tracking-[0.28em] text-ink/70 hover:text-gold"
          >
            See recent work
          </a>
        </div>
      </div>

      <div className="hero-cue absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-ink-dim">
        Scroll
      </div>
    </section>
  );
}
