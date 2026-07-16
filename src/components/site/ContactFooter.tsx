import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useSectionReveal } from "@/hooks/useReveal";

const schema = z.object({
  name: z.string().trim().min(1, "Your name is required").max(120),
  restaurant_name: z.string().trim().max(160).optional(),
  phone: z.string().trim().max(60).optional(),
  message: z.string().trim().max(2000).optional(),
});

type Status = "idle" | "loading" | "sent" | "error";

export function ContactFooter() {
  const ref = useSectionReveal<HTMLElement>();
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      restaurant_name: fd.get("restaurant_name") || undefined,
      phone: fd.get("phone") || undefined,
      message: fd.get("message") || undefined,
    });
    if (!parsed.success) {
      setStatus("error");
      setErr(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    setStatus("loading");
    setErr("");
    const { error } = await supabase.from("leads").insert(parsed.data);
    if (error) {
      setStatus("error");
      setErr("Something went wrong. Please try Instagram instead.");
      return;
    }
    setStatus("sent");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <footer
      ref={ref}
      id="contact"
      className="border-t border-[color:var(--border)] bg-[#050505] px-6 pt-32 pb-16 md:px-14 md:pt-48"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-16 md:grid-cols-[1.1fr_1fr] md:gap-24">
          <div>
            <p data-reveal className="mb-6 font-sans text-[11px] uppercase tracking-[0.32em] text-gold">
              Contact
            </p>
            <h2 data-reveal className="font-display text-[clamp(2rem,4.8vw,3.8rem)] leading-[1.05] text-ink">
              Send us a note.<br />Or DM us. Either works.
            </h2>
            <p data-reveal className="mt-8 max-w-md font-tagline text-lg text-ink/70">
              We reply to Instagram fastest &mdash; usually within a few hours during the day.
            </p>
            <a
              data-reveal
              href="https://ig.me/m/jutt.brothers.dev"
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-flex items-center gap-3 border border-gold/60 px-7 py-4 text-[12px] uppercase tracking-[0.28em] text-gold transition-all hover:bg-gold hover:text-[#050505]"
            >
              Instagram DM &rarr;
            </a>
          </div>

          <form onSubmit={onSubmit} data-reveal className="space-y-5">
            <Field name="name" label="Your name" required />
            <Field name="restaurant_name" label="Restaurant name" />
            <Field name="phone" label="Phone or WhatsApp" />
            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-ink-dim">
                Message
              </label>
              <textarea
                name="message"
                rows={5}
                className="w-full resize-none border border-[color:var(--border)] bg-[#0a0a0a] px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-gold"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center gap-3 bg-gold px-7 py-4 text-[12px] uppercase tracking-[0.28em] text-[#050505] transition-all hover:bg-[#e0be74] disabled:opacity-60"
            >
              {status === "loading" ? "Sending…" : status === "sent" ? "Thank you — we'll be in touch." : "Send"}
            </button>
            {status === "error" && (
              <p className="text-[12px] uppercase tracking-[0.24em] text-red-400/90">{err}</p>
            )}
          </form>
        </div>

        <div className="mt-24 flex flex-col items-start justify-between gap-6 border-t border-[color:var(--border)] pt-8 md:flex-row md:items-center">
          <p className="font-display text-[13px] tracking-[0.32em] text-ink">JUTT BROTHERS</p>
          <p className="text-[11px] uppercase tracking-[0.24em] text-ink-dim">
            Rawalpindi &middot; Est. hospitality
          </p>
          <p className="text-[11px] uppercase tracking-[0.24em] text-ink-dim">
            &copy; {new Date().getFullYear()} — all rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

function Field({ name, label, required }: { name: string; label: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-ink-dim">
        {label}
        {required && <span className="text-gold"> *</span>}
      </label>
      <input
        name={name}
        required={required}
        type="text"
        className="w-full border border-[color:var(--border)] bg-[#0a0a0a] px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-gold"
      />
    </div>
  );
}
