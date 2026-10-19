"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { useI18n, Lang } from "@/lib/i18n";
import { ArrowRightIcon, CloseIcon, MenuIcon } from "./Icons";

function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  const btn = (l: Lang, label: string) => (
    <button
      type="button"
      onClick={() => setLang(l)}
      aria-pressed={lang === l}
      className={`px-3 py-1.5 font-mono text-xs font-bold transition-colors ${
        lang === l ? "bg-black text-white" : "bg-white text-black hover:bg-sun"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div className={`flex border-2 border-black ${className}`}>
      {btn("en", "EN")}
      {btn("id", "IND")}
    </div>
  );
}

export default function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  const links = [
    { id: "about", label: t.nav.about },
    { id: "projects", label: t.nav.projects },
    { id: "contact", label: t.nav.contacts },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // animasi buka sidebar
  useEffect(() => {
    if (!(mounted && open) || !panel.current || !overlay.current) return;
    animate(overlay.current, { opacity: [0, 1], duration: 300, ease: "outQuad" });
    animate(panel.current, { translateX: ["100%", "0%"], duration: 550, ease: "outExpo" });
    animate(panel.current.querySelectorAll("[data-item]"), {
      opacity: [0, 1],
      translateX: [32, 0],
      delay: stagger(70, { start: 180 }),
      duration: 550,
      ease: "outExpo",
    });
  }, [mounted, open]);

  const openMenu = () => {
    document.body.style.overflow = "hidden";
    setMounted(true);
    setOpen(true);
  };

  const closeMenu = () => {
    document.body.style.overflow = "";
    setOpen(false);
    if (!panel.current || !overlay.current) {
      setMounted(false);
      return;
    }
    animate(overlay.current, { opacity: 0, duration: 250, ease: "outQuad" });
    animate(panel.current, { translateX: "100%", duration: 380, ease: "inExpo", onComplete: () => setMounted(false) });
  };

  // tutup sidebar jika layar membesar
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768 && mounted) {
        document.body.style.overflow = "";
        setOpen(false);
        setMounted(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mounted]);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const wasOpen = open;
    if (wasOpen) closeMenu();
    window.setTimeout(
      () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }),
      wasOpen ? 300 : 0
    );
  };

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 w-full bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-[0_4px_0_0_#000]" : "shadow-[0_1px_0_0_rgba(0,0,0,0.12)]"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6 lg:gap-10">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2.5"
              aria-label="Da7A home"
            >
              <span className="flex h-10 w-10 items-center justify-center bg-sun">
                <img src="/images/BlackLogo_NoCircle.png" alt="" className="h-8 w-8 mix-blend-multiply" />
              </span>
              <span className="text-xl font-bold leading-none">
                Da7A<span className="text-[0.55em]">.</span>
              </span>
            </a>
            <ul className="hidden items-center gap-8 md:flex">
              {links.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => go(e, l.id)}
                    className="font-mono text-sm transition-colors hover:text-sky"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3">
            <LangToggle />
            <a
              href="#contact"
              onClick={(e) => go(e, "contact")}
              className="hidden items-center gap-2 bg-sun px-4 py-2 font-mono text-xs font-bold transition-all hover:-translate-y-0.5 hover:brightness-95 hover:shadow-card md:inline-flex"
            >
              <ArrowRightIcon className="h-4 w-4" />
              {t.nav.contactMe}
            </a>
            <button
              type="button"
              onClick={openMenu}
              aria-label={t.nav.menu}
              className="flex h-10 w-10 items-center justify-center border-2 border-black bg-sun md:hidden"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </header>

      {mounted && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            ref={overlay}
            onClick={closeMenu}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            style={{ opacity: 0 }}
          />
          <div
            ref={panel}
            className="absolute right-0 top-0 flex h-full w-[78%] max-w-xs flex-col bg-black p-6 text-white"
            style={{ transform: "translateX(100%)" }}
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="text-xl font-bold">
                Da7A<span className="text-sun">.</span>
              </span>
              <button
                type="button"
                onClick={closeMenu}
                aria-label={t.nav.close}
                className="flex h-10 w-10 items-center justify-center border-2 border-white"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <ul className="flex flex-col gap-2">
              {links.map((l, i) => (
                <li key={l.id} data-item style={{ opacity: 0 }}>
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => go(e, l.id)}
                    className="flex items-center justify-between border-b border-white/20 py-4 text-2xl font-bold hover:text-sun"
                  >
                    <span>{l.label}</span>
                    <span className="font-mono text-xs text-white/50">0{i + 1}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-4" data-item style={{ opacity: 0 }}>
              <a
                href="#contact"
                onClick={(e) => go(e, "contact")}
                className="inline-flex items-center justify-center gap-2 bg-sun px-4 py-3 font-mono text-sm font-bold text-black"
              >
                <ArrowRightIcon className="h-4 w-4" />
                {t.nav.contactMe}
              </a>
              <LangToggle className="self-start" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
