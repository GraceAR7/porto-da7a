"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { animate } from "animejs";
import { getReady, subscribeReady } from "@/lib/ready";

type Variant = "up" | "down" | "left" | "right" | "scale" | "fade";

const FROM: Record<Variant, { x: number; y: number; s: number }> = {
  up: { x: 0, y: 48, s: 1 },
  down: { x: 0, y: -48, s: 1 },
  left: { x: -64, y: 0, s: 1 },
  right: { x: 64, y: 0, s: 1 },
  scale: { x: 0, y: 0, s: 0.88 },
  fade: { x: 0, y: 0, s: 1 },
};

interface Props {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  delay?: number;
}

/** Animasi masuk (Anime.js) saat elemen terlihat saat scroll. */
export default function Reveal({ children, className = "", variant = "up", delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  const ready = useSyncExternalStore(subscribeReady, getReady, () => false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !ready || done.current) return;

    const run = () => {
      if (done.current) return;
      done.current = true;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.style.opacity = "1";
        return;
      }
      const f = FROM[variant];
      animate(el, {
        opacity: [0, 1],
        translateX: [f.x, 0],
        translateY: [f.y, 0],
        scale: [f.s, 1],
        duration: 900,
        delay,
        ease: "outExpo",
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ready, variant, delay]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
