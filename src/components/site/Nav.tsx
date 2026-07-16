import { useEffect, useState } from "react";

const links = [
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Get a Quote", href: "#quote" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-black/60 border-b border-[color:var(--border)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
        <a href="#top" className="font-display text-[13px] tracking-[0.32em] text-ink">
          JUTT BROTHERS
        </a>
        <ul className="hidden gap-9 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-[12px] tracking-[0.22em] uppercase text-ink/70 transition-colors hover:text-gold"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="https://ig.me/m/jutt.brothers.dev"
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-2 border border-gold/50 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-gold transition-all hover:bg-gold hover:text-[#050505]"
        >
          Start a conversation
        </a>
      </nav>
    </header>
  );
}
