"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { useI18n } from "@/lib/i18n";
import Reveal from "./Reveal";

export default function Hero() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);

  // Idle animation: bentuk melayang / berayun pelan agar halaman terasa hidup
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const anims: { revert: () => unknown }[] = [];

    el.querySelectorAll<HTMLElement>("[data-idle]").forEach((node, i) => {
      const kind = node.dataset.idle;
      const dur = 2600 + (i % 4) * 450;
      if (kind === "float") {
        anims.push(
          animate(node, {
            translateY: [0, i % 2 ? -16 : 16],
            translateX: [0, i % 2 ? 8 : -8],
            duration: dur,
            ease: "inOutSine",
            loop: true,
            alternate: true,
          })
        );
      } else if (kind === "pulse") {
        // gunung: berdenyut dari kiri-bawah; segitiga atas: dari sisi atas (tetap menempel navbar)
        node.style.transformOrigin = node.dataset.origin ?? "0% 100%";
        anims.push(
          animate(node, {
            scale: [1, 1.07],
            duration: dur + 800,
            ease: "inOutQuad",
            loop: true,
            alternate: true,
          })
        );
      }
    });

    return () => anims.forEach((a) => a.revert());
  }, []);

  return (
    <section
      ref={root}
      id="top"
      className="relative overflow-hidden bg-cream"
      style={{ minHeight: "max(620px, 52.8vw)" }}
    >
      {/* Lingkaran kiri atas */}
      <div
        data-idle="float"
        className="absolute rounded-full bg-charcoal"
        style={{ left: "1.5%", top: "5.6%", width: "clamp(52px,8vw,120px)", height: "clamp(52px,8vw,120px)" }}
      />
      <div
        data-idle="float"
        className="absolute rounded-full bg-sky"
        style={{ left: "7%", top: "14.4%", width: "clamp(32px,5vw,76px)", height: "clamp(32px,5vw,76px)" }}
      />

      {/* Segitiga kanan atas */}
      <div
        data-idle="pulse" data-origin="50% 0%"
        className="absolute bg-black"
        style={{
          left: "74.6%",
          top: 0,
          width: "9.7vw",
          height: "8.4vw",
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
        }}
      />
      <div
        data-idle="pulse" data-origin="50% 0%"
        className="absolute bg-black"
        style={{
          left: "84.2%",
          top: 0,
          width: "15.8vw",
          height: "13.9vw",
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
        }}
      />

      {/* Gunung kiri bawah */}
      <svg
        data-idle="pulse"
        className="absolute bottom-0 left-0"
        style={{ width: "29.5vw", height: "18vw" }}
        viewBox="0 0 350 214"
        preserveAspectRatio="none"
        aria-hidden
      >
        <polygon points="0,214 120,0 250,214" fill="#000" />
        <polygon points="215,214 287,107 350,214" fill="#000" />
      </svg>

      {/* Lingkaran kanan bawah */}
      <div
        data-idle="float"
        className="absolute rounded-full bg-sky"
        style={{ left: "77.3%", top: "67%", width: "clamp(48px,8.8vw,130px)", height: "clamp(48px,8.8vw,130px)" }}
      />
      <div
        data-idle="float"
        className="absolute rounded-full bg-charcoal"
        style={{ left: "84.3%", top: "67%", width: "clamp(72px,14.5vw,215px)", height: "clamp(72px,14.5vw,215px)" }}
      />

      {/* Konten */}
      <div
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5 text-center"
        style={{ paddingTop: "clamp(40px,6vw,84px)", paddingBottom: "clamp(120px,20vw,260px)" }}
      >
        <Reveal variant="down">
          <span className="inline-block bg-black px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-wide text-white sm:text-xs">
            {t.hero.badge}
          </span>
        </Reveal>

        <Reveal delay={150} className="mt-10 sm:mt-14">
          <h1 className="font-sans text-[clamp(1.75rem,5.2vw,4.4rem)] font-bold leading-[1.1] tracking-tight">
            <span className="block">{t.hero.title1}</span>
            <span className="mt-2 inline-block bg-sun px-3 text-sky sm:px-5">{t.hero.title2}</span>
          </h1>
        </Reveal>

        <Reveal delay={320} className="mt-8 max-w-[44rem] sm:mt-10">
          <p className="font-mono text-xs leading-relaxed text-neutral-800 sm:text-sm">{t.hero.desc}</p>
        </Reveal>
      </div>
    </section>
  );
}
