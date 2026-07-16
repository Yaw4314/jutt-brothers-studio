import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type RefObject } from "react";
import { prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Attach to a section root; direct children with [data-reveal] get a
 * staggered fade + slight y-translate on scroll. Respects prefers-reduced-motion.
 */
export function useSectionReveal<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);
  useGSAP(
    () => {
      if (!ref.current) return;
      if (prefersReducedMotion()) {
        gsap.set(ref.current.querySelectorAll("[data-reveal]"), { opacity: 1, y: 0 });
        return;
      }
      const targets = ref.current.querySelectorAll("[data-reveal]");
      if (!targets.length) return;
      gsap.from(targets, {
        opacity: 0,
        y: 32,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 78%",
        },
      });
    },
    { scope: ref },
  );
  return ref;
}
