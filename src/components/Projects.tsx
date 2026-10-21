"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { useI18n } from "@/lib/i18n";
import { Category, Project, ProjectRecord, fromProjectRecord, marqueeItems, projects, techLabels } from "@/lib/projects";
import { supabase } from "@/lib/supabase";
import Reveal from "./Reveal";
import Tip from "./Tip";
import TechIcon from "./TechIcon";
import ProjectModal from "./ProjectModal";
import { ImageIcon, TriangleRight } from "./Icons";

const CATEGORIES: Category[] = ["websites", "desktop", "games", "mobile"];

export default function Projects() {
  const { t, lang } = useI18n();
  const [cat, setCat] = useState<Category>("websites");
  const [selected, setSelected] = useState<Project | null>(null);
  const [projectList, setProjectList] = useState<Project[]>(projects);
  const scroller = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  const list = projectList.filter((p) => p.category === cat);
  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(
      new Date(iso)
    );

  // animasi kartu saat ganti tab
  useEffect(() => {
    if (!supabase) return;
    let active = true;

    supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (active && !error && data) setProjectList((data as ProjectRecord[]).map(fromProjectRecord));
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    animate(el.querySelectorAll("[data-card]"), {
      opacity: [0, 1],
      translateY: [36, 0],
      delay: stagger(90),
      duration: 700,
      ease: "outExpo",
    });
  }, [cat]);

  const next = () => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = (card?.offsetWidth ?? 220) + 20;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: "smooth" });
  };

  const items = [...marqueeItems, ...marqueeItems];

  return (
    <section id="projects" className="scroll-mt-16 bg-sky">
      <div className="flex justify-center pb-4 pt-6 sm:pb-5 sm:pt-7">
        <Reveal variant="scale">
          <h2 className="bg-black px-7 py-2 font-sans text-xl font-bold text-white shadow-[4px_4px_0_0_rgba(0,0,0,0.25)] sm:px-9 sm:text-2xl">
            {t.projects.title}
          </h2>
        </Reveal>
      </div>

      {/* Marquee bahasa pemrograman */}
      <div className="overflow-hidden bg-white py-1.5" aria-hidden>
        <div className="marquee-track font-mono text-[10px] font-bold uppercase text-black sm:text-[11px]">
          {[0, 1].map((n) => (
            <div key={n} className="flex shrink-0 items-center">
              {items.map((m, i) => (
                <span key={`${n}-${i}`} className="flex items-center">
                  <span className="px-4">{m}</span>
                  <span className="text-sky">&#9670;</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative bg-cream pb-5 pt-3">
        {/* Tab kategori */}
        <Reveal className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-2 gap-y-2 px-4 sm:px-8">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`rounded-full px-4 py-1.5 font-mono text-xs transition-all duration-300 sm:text-[13px] ${
                cat === c ? "bg-sun font-bold shadow-card" : "hover:bg-sun/40"
              }`}
            >
              {t.projects.tabs[c]}
            </button>
          ))}
        </Reveal>

        {/* Kartu */}
        <Reveal delay={100} className="relative mx-auto mt-4 max-w-[1280px]">
          <div
            ref={scroller}
            className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-5 pr-4 pt-3 sm:px-8 sm:pr-14"
          >
            {list.map((p) => (
              <article
                key={p.id}
                data-card
                role="button"
                tabIndex={0}
                aria-label={`${t.projects.detail.open}: ${p.name}`}
                onClick={() => setSelected(p)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(p);
                  }
                }}
                className="project-card flex w-[min(220px,72vw)] shrink-0 cursor-pointer snap-start flex-col bg-white p-2.5 text-left shadow-card focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-black"
              >
                <div className="flex aspect-[247/105] items-center justify-center overflow-hidden bg-[#d6d6d6] text-[#7a7a7a]">
                  {p.images[0] ? (
                    <img src={p.images[0]} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-10 w-10" />
                  )}
                </div>
                <h3 className="mt-2 font-sans text-sm font-bold">{p.name}</h3>
                <p className="mt-0.5 min-h-[2.2rem] font-mono text-[10px] leading-snug text-neutral-700">
                  {p.desc[lang]}
                </p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="font-mono text-[9px] text-neutral-600">{t.projects.lastUpdated}</p>
                    <span className="mt-0.5 inline-block bg-black px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
                      {fmtDate(p.updated)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-700">
                    {p.tech.slice(0, 3).map((k) => (
                      <Tip key={k} label={techLabels[k]}>
                        <TechIcon tech={k} className="h-[18px] w-[18px]" />
                      </Tip>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label={t.projects.next}
            className="absolute right-0 top-1/2 hidden h-40 w-8 -translate-y-1/2 items-center justify-center bg-black text-white transition-colors hover:bg-charcoal sm:flex sm:w-9"
          >
            <TriangleRight className="h-3.5 w-3.5" />
          </button>
        </Reveal>
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
