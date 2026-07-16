import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const projects = [
  { name: "Rue", tag: "Neighborhood bistro" },
  { name: "Deejos", tag: "Cafe & bakery" },
  { name: "Trivana", tag: "Fine dining" },
  { name: "Coco Cubano", tag: "Latin bar & kitchen" },
  { name: "Fuòco", tag: "Wood-fire pizza" },
  { name: "Koffee Net", tag: "Coffee, all day" },
  { name: "Eatly Rooftop", tag: "Rooftop dining" },
  { name: "Le Balto", tag: "Brasserie" },
  { name: "Bunny Brownie", tag: "Dessert bar" },
];

export function Work() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const cards = ref.current.querySelectorAll<HTMLElement>("[data-card]");
      if (prefersReducedMotion()) {
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }
      gsap.from(cards, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });

      cards.forEach((card) => {
        const img = card.querySelector<HTMLElement>("[data-parallax]");
        if (!img) return;
        gsap.to(img, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="work"
      className="border-t border-[color:var(--border)] px-6 py-32 md:px-14 md:py-48"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-5 font-sans text-[11px] uppercase tracking-[0.32em] text-gold">
              Selected work
            </p>
            <h2 className="font-display text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.05] text-ink">
              A house of restaurants.
            </h2>
          </div>
          <p className="max-w-md text-[11px] uppercase tracking-[0.24em] text-ink-dim">
            Placeholder content shown pending permission from each restaurant.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <article
              key={p.name}
              data-card
              className="group relative overflow-hidden border border-[color:var(--border)] bg-[#0a0a0a]"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <div
                  data-parallax
                  className="absolute inset-[-12%] flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle at ${30 + (i % 3) * 20}% ${30 + (i % 2) * 30}%, rgba(207,170,92,0.28), rgba(5,5,5,1) 65%)`,
                  }}
                >
                  <span className="font-display text-[clamp(3rem,6vw,5rem)] tracking-[0.06em] text-gold/25">
                    {p.name}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
              </div>
              <div className="flex items-end justify-between px-6 py-5">
                <div>
                  <h3 className="font-display text-lg text-ink group-hover:text-gold transition-colors">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-ink-dim">
                    {p.tag}
                  </p>
                </div>
                <span className="text-[11px] uppercase tracking-[0.24em] text-ink-dim">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
