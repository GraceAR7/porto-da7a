"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { SITE } from "@/lib/config";
import Reveal from "./Reveal";

const field =
  "w-full border border-neutral-600 bg-black px-3 py-2.5 font-mono text-xs text-white placeholder:text-neutral-600 focus:border-sun focus:outline-none";
const label = "mb-1.5 block font-mono text-[11px] text-white";

export default function Contact() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = `${f.get("first") ?? ""} ${f.get("last") ?? ""}`.trim();
    const body = `${f.get("message") ?? ""}\n\n— ${name} (${f.get("email") ?? ""})`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      `Collab: ${name}`
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <div className="bg-black">
      {/* pita biru dengan sudut miring */}
      <div
        className="bg-sky"
        style={{
          height: "clamp(56px,11.2vw,160px)",
          clipPath: "polygon(0 0, 100% 0, 100% 55%, 95% 100%, 5% 100%, 0 55%)",
        }}
      />

      <section id="contact" className="scroll-mt-16 px-5 pb-16 pt-10 sm:px-8 lg:pb-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="left" className="order-2 flex justify-center lg:order-1">
            <img
              src="/images/WhiteLogo_Circle.png"
              alt=""
              className="w-[min(70vw,400px)] opacity-[0.1]"
              aria-hidden
            />
          </Reveal>

          <Reveal variant="right" className="order-1 lg:order-2">
            <h2 className="font-sans text-base font-bold sm:text-lg">
              <span className="text-white">{t.contact.title1}</span> <span className="text-sun">{t.contact.title2}</span>
            </h2>
            <p className="mt-2 max-w-md font-sans text-xs text-neutral-500">{t.contact.desc}</p>

            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="first" className={label}>
                    {t.contact.firstName}
                  </label>
                  <input id="first" name="first" required placeholder={t.contact.firstPh} className={field} />
                </div>
                <div>
                  <label htmlFor="last" className={label}>
                    {t.contact.lastName}
                  </label>
                  <input id="last" name="last" required placeholder={t.contact.lastPh} className={field} />
                </div>
              </div>
              <div>
                <label htmlFor="email" className={label}>
                  {t.contact.email}
                </label>
                <input id="email" name="email" type="email" required placeholder={t.contact.emailPh} className={field} />
              </div>
              <div>
                <label htmlFor="message" className={label}>
                  {t.contact.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder={t.contact.messagePh}
                  className={`${field} resize-none`}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-sun py-3 font-sans text-xs font-bold text-black transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {t.contact.submit}
              </button>
              {sent && <p className="font-mono text-xs text-sun">{t.contact.thanks}</p>}
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
