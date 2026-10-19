"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { setReady } from "@/lib/ready";

export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLImageElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const rootEl = root.current;
    const logoEl = logo.current;
    const barEl = bar.current;
    if (!rootEl || !logoEl || !barEl) return;

    let cancelled = false;
    const anims: { revert: () => unknown }[] = [];
    document.body.style.overflow = "hidden";

    const letters = rootEl.querySelectorAll<HTMLElement>("[data-letter]");

    anims.push(
      animate(logoEl, { opacity: [0, 1], scale: [0.5, 1], rotate: [-14, 0], duration: 1000, ease: "outBack" }),
      animate(letters, { opacity: [0, 1], translateY: [24, 0], delay: stagger(90, { start: 450 }), duration: 700, ease: "outExpo" })
    );

    // Tunggu bar penuh DAN halaman selesai dimuat
    const pageLoaded = new Promise<void>((res) => {
      if (document.readyState === "complete") res();
      else window.addEventListener("load", () => res(), { once: true });
    });
    const barDone = new Promise<void>((res) => {
      anims.push(
        animate(barEl, { width: ["0%", "100%"], duration: 1700, delay: 300, ease: "inOutQuad", onComplete: () => res() })
      );
    });

    Promise.all([pageLoaded, barDone]).then(() => {
      if (cancelled) return;
      anims.push(
        animate(logoEl, { scale: [1, 1.12], opacity: [1, 0], duration: 350, ease: "inQuad" }),
        animate(rootEl, {
          translateY: ["0%", "-100%"],
          duration: 900,
          delay: 250,
          ease: "inOutExpo",
          onComplete: () => {
            if (cancelled) return;
            document.body.style.overflow = "";
            setReady();
            setGone(true);
          },
        })
      );
    });

    return () => {
      cancelled = true;
      document.body.style.overflow = "";
      anims.forEach((a) => a.revert());
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-black"
      aria-label="Loading"
      role="status"
    >
      {/* aksen warna */}
      <div className="absolute left-0 top-0 h-2 w-full bg-sun" />
      <div className="absolute bottom-0 left-0 h-2 w-full bg-sky" />

      <img
        ref={logo}
        src="/images/WhiteLogo_Circle.png"
        alt=""
        className="h-28 w-28 opacity-0 sm:h-36 sm:w-36"
      />
      <div className="flex font-sans text-3xl font-bold tracking-wide text-white sm:text-4xl" aria-hidden>
        {"Da7A".split("").map((c, i) => (
          <span key={i} data-letter className="inline-block opacity-0">
            {c}
          </span>
        ))}
        <span data-letter className="inline-block text-sun opacity-0">
          .
        </span>
      </div>
      <div className="h-[3px] w-44 overflow-hidden bg-white/20 sm:w-56">
        <div ref={bar} className="h-full w-0 bg-sun" />
      </div>
    </div>
  );
}
