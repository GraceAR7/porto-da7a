"use client";

import { useRef, useState } from "react";
import { animate } from "animejs";
import { renderBold, useI18n } from "@/lib/i18n";
import { SITE } from "@/lib/config";
import Reveal from "./Reveal";
import VideoPlayer from "./VideoPlayer";
import LikeButton from "./LikeButton";
import Tip from "./Tip";
import { TriangleLeft, TriangleRight } from "./Icons";

// Urutan slide: What?, Who?, Why?
const HEADER_BG = ["bg-coral", "bg-sky", "bg-sun"];
const GALLERY = ["/images/gallery/what.jpg", "/images/gallery/who.jpg", "/images/gallery/why.jpg"];

function MaskIcon({ src, className }: { src: string; className: string }) {
  const style: React.CSSProperties = {
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  };
  return <span aria-hidden className={`block ${className}`} style={style} />;
}

export default function About() {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const touchX = useRef<number | null>(null);
  const total = t.about.slides.length;

  const go = (dir: 1 | -1) => {
    const el = slideRef.current;
    if (!el || busy.current) return;
    busy.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIndex((i) => (i + dir + total) % total);
      busy.current = false;
      return;
    }
    // keluar
    animate(el, {
      translateX: ["0%", `${-dir * 100}%`],
      opacity: [1, 0.2],
      duration: 380,
      ease: "inCubic",
      onComplete: () => {
        setIndex((i) => (i + dir + total) % total);
        // masuk (setelah React merender slide berikutnya)
        requestAnimationFrame(() => {
          animate(el, {
            translateX: [`${dir * 100}%`, "0%"],
            opacity: [0.2, 1],
            duration: 650,
            ease: "outExpo",
            onComplete: () => {
              busy.current = false;
            },
          });
        });
      },
    });
  };

  const slide = t.about.slides[index];

  const socials = [
    { key: "youtube", href: SITE.socials.youtube, icon: "/images/icons/youtube.png", color: "bg-coral", border: "border-coral", label: "YouTube" },
    { key: "itch", href: SITE.socials.itch, icon: "/images/icons/itch.svg", color: "bg-sun", border: "border-sun", label: "itch.io" },
    { key: "linkedin", href: SITE.socials.linkedin, icon: "/images/icons/linkedin.png", color: "bg-sky", border: "border-sky", label: "LinkedIn" },
  ] as const;

  return (
    <section id="about" className="scroll-mt-16 bg-black">
      <div className="grid lg:h-[max(540px,calc(100vh_-_4rem))] lg:grid-cols-[41.8%_58.2%]">
        {/* Kiri: intro + video */}
        <div className="flex flex-col justify-center px-5 py-8 sm:px-8 lg:py-4">
          <Reveal variant="left">
            <h2 className="font-sans text-[clamp(1.15rem,2.1vw,1.75rem)] font-bold leading-tight text-sun">
              {t.intro.title1}
            </h2>
            <span className="mt-1 inline-block bg-sky px-2 font-sans text-[clamp(1.15rem,2.1vw,1.75rem)] font-bold leading-tight text-black">
              {t.intro.title2}
            </span>
          </Reveal>

          <Reveal delay={120} className="mt-4 text-center font-mono text-xs text-white">
            {t.intro.caption1} <b>{SITE.owner}</b> {t.intro.caption2}
          </Reveal>

          <Reveal
            variant="scale"
            delay={200}
            className="mx-auto mt-3 w-full lg:w-[min(100%,max(320px,calc((100vh_-_19rem)*1.7778)))]"
          >
            <VideoPlayer />
          </Reveal>

          <Reveal delay={260} className="mx-auto mt-3 w-full lg:w-[min(100%,max(320px,calc((100vh_-_19rem)*1.7778)))]">
            <LikeButton />
          </Reveal>

          <Reveal delay={320} className="mt-4 text-center font-mono text-xs text-white">
            {t.intro.socials}
          </Reveal>

          <Reveal delay={380} className="mt-4 flex items-center justify-center gap-10 sm:gap-14">
            {socials.map((s) => (
              <Tip key={s.key} label={t.intro.tip[s.key]}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.label}: ${t.intro.tip[s.key]}`}
                  className={`flex h-11 w-11 items-center justify-center border-[4px] transition-transform duration-300 hover:-translate-y-1 hover:scale-105 focus-visible:-translate-y-1 sm:h-12 sm:w-12 ${s.border}`}
                >
                  <MaskIcon src={s.icon} className={`h-6 w-6 sm:h-7 sm:w-7 ${s.color}`} />
                </a>
              </Tip>
            ))}
          </Reveal>
        </div>

        {/* Kanan: slider About (setengah bagian) */}
        <div
          className="overflow-hidden lg:min-h-0"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
          }}
        >
          <Reveal variant="right" className="h-full">
            <div ref={slideRef} className="flex h-full flex-col">
              <div className={`${HEADER_BG[index]} shrink-0 px-5 py-4 transition-colors duration-500 sm:px-7`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-sans text-xl font-bold leading-none text-black sm:text-2xl">{t.about.label}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <h3 className="bg-black px-3 py-0.5 font-sans text-lg font-bold text-white sm:text-2xl">
                        {slide.title}
                      </h3>
                      <div className="flex gap-2.5">
                        <button
                          type="button"
                          onClick={() => go(-1)}
                          aria-label={t.about.prev}
                          className="flex h-9 w-9 items-center justify-center bg-white text-black shadow-card transition-transform hover:-translate-x-0.5 active:scale-95"
                        >
                          <TriangleLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => go(1)}
                          aria-label={t.about.next}
                          className="flex h-9 w-9 items-center justify-center bg-white text-black shadow-card transition-transform hover:translate-x-0.5 active:scale-95"
                        >
                          <TriangleRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-white shadow-card">
                    <img src="/images/BlackLogo_NoCircle.png" alt="" className="h-7 w-7 mix-blend-multiply" />
                  </span>
                </div>

                <div className="mt-3 bg-white p-2.5 font-mono text-[11px] leading-relaxed text-neutral-800">
                  {renderBold(slide.body)}
                </div>
              </div>

              {/* Kolase (gambar sudah disusun sendiri) */}
              <div className="relative aspect-[3/2] w-full bg-black lg:aspect-auto lg:min-h-0 lg:flex-1">
                <img
                  key={GALLERY[index]}
                  src={GALLERY[index]}
                  alt={slide.title}
                  className="absolute inset-0 h-full w-full object-contain"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
