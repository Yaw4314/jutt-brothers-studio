import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    n: "01",
    title: "We study your restaurant",
    body: "Menu, guests, competitors, neighborhood. We look at what already works on your Instagram and what breaks the moment a hungry stranger tries to book.",
  },
  {
    n: "02",
    title: "We build a live demo",
    body: "You do not brief us for weeks. You do not sign a proposal. We build a working demo of your site on your brand, on our own time, and send you the link.",
  },
  {
    n: "03",
    title: "You approve, or you don't",
    body: "If the demo does not feel like your restaurant, we walk away. No invoice, no hard feelings. If it does, we agree on a scope and lock a launch date.",
  },
  {
    n: "04",
    title: "We launch and maintain",
    body: "Domain, hosting, analytics, edits, seasonal menu drops, holiday hours. You keep running the kitchen; we keep the site alive.",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const panels = Array.from(
        ref.current.querySelectorAll<HTMLElement>("[data-step]"),
      );

      if (prefersReducedMotion()) {
        // Reduced motion: no pin, no scrub. Stack panels statically.
        gsap.set(panels, { position: "relative", opacity: 1, y: 0 });
        return;
      }

      const ctx = gsap.context(() => {
        // Initial state
        panels.forEach((p, i) => {
          gsap.set(p, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 32 });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current!,
            start: "top top",
            end: () => `+=${(panels.length - 1) * 100}%`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progressEl =
                ref.current!.querySelector<HTMLElement>("[data-progress]");
              if (progressEl) progressEl.style.width = `${self.progress * 100}%`;
            },
          },
        });

        // Cross-fade each panel into the next
        for (let i = 0; i < panels.length - 1; i++) {
          tl.to(panels[i], { opacity: 0, y: -16, ease: "power2.inOut" }, i)
            .fromTo(
              panels[i + 1],
              { opacity: 0, y: 32 },
              { opacity: 1, y: 0, ease: "power2.inOut" },
              i,
            );
        }
      }, ref);

      // Recompute after Lenis + fonts/images settle
      const refresh = () => ScrollTrigger.refresh();
      const t = window.setTimeout(refresh, 50);
      if (document.fonts?.ready) document.fonts.ready.then(refresh).catch(() => {});
      window.addEventListener("load", refresh);

      return () => {
        window.clearTimeout(t);
        window.removeEventListener("load", refresh);
        ctx.revert();
      };
    },
    { scope: ref },
  );

  return (
    <section
      id="process"
      className="relative z-[1] bg-[#050505] border-t border-[color:var(--border)]"
    >
      <div ref={ref} className="relative h-[100svh] w-full overflow-hidden bg-[#050505]">
        <div className="absolute inset-x-0 top-24 z-20 px-6 md:px-14">
          <p className="font-sans text-[11px] uppercase tracking-[0.32em] text-gold">
            How it works
          </p>
          <div className="mt-3 h-px w-full bg-[color:var(--border)]">
            <div data-progress className="h-px w-0 bg-gold" />
          </div>
        </div>

        <div className="relative z-10 flex h-full items-center px-6 md:px-14">
          <div className="mx-auto grid w-full max-w-[1200px] gap-12 md:grid-cols-[220px_1fr] md:gap-24">
            <div className="hidden md:block">
              <p className="font-display text-[11px] tracking-[0.32em] text-ink-dim">
                Four steps.<br/>Zero risk.
              </p>
            </div>
            <div className="relative min-h-[340px]">
              {steps.map((s, i) => (
                <article
                  key={s.n}
                  data-step
                  className={`absolute inset-0 flex flex-col justify-center will-change-[transform,opacity] ${
                    i === 0 ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="font-display text-[11px] tracking-[0.32em] text-gold">
                    Step {s.n}
                  </span>
                  <h3 className="mt-6 font-display text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.05] text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-6 max-w-xl font-tagline text-lg text-ink/75 md:text-xl">
                    {s.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
