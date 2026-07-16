import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Problem } from "@/components/site/Problem";
import { WhatWeDo } from "@/components/site/WhatWeDo";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Work } from "@/components/site/Work";
import { GetAQuote } from "@/components/site/GetAQuote";
import { About } from "@/components/site/About";
import { ContactFooter } from "@/components/site/ContactFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jutt Brothers — Restaurant websites, built before you say yes" },
      {
        name: "description",
        content:
          "A design and engineering studio in Rawalpindi. We build websites, ordering and booking tools for independent restaurants — starting with a free live demo of your site.",
      },
      { property: "og:title", content: "Jutt Brothers — Restaurant websites, built before you say yes" },
      {
        property: "og:description",
        content:
          "A design and engineering studio in Rawalpindi. We build websites, ordering and booking tools for independent restaurants — starting with a free live demo of your site.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SmoothScroll>
      <main className="relative bg-[#050505] text-ink">
        <Nav />
        <Hero />
        <Problem />
        <WhatWeDo />
        <HowItWorks />
        <Work />
        <GetAQuote />
        <About />
        <ContactFooter />
      </main>
    </SmoothScroll>
  );
}
