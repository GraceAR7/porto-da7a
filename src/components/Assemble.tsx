"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { animate } from "animejs";
import { getReady, subscribeReady } from "@/lib/ready";

/**
 * Efek "menyusun halaman": section berikutnya dibangun dari atas ke bawah
 * (tirai terbuka + naik) saat di-scroll. Elemen di dalamnya punya animasi
 * susun sendiri lewat <Reveal>.
 */
export default function Assemble({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  const ready = useSyncExternalStore(subscribeReady, getReady, () => false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !ready || done.current) return;

    const finish = () => {
      el.style.opacity = "1";
      el.style.clipPath = "none";
      el.style.transform = "none";
    };

    const run = () => {
      if (done.current) return;
      done.current = true;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return finish();
      animate(el, {
        clipPath: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"],
        opacity: [0, 1],
        translateY: [70, 0],
        duration: 1100,
        ease: "outExpo",
        onComplete: finish,
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.04 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ready]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
