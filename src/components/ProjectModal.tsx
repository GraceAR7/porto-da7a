"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { useI18n } from "@/lib/i18n";
import { Project, techLabels } from "@/lib/projects";
import { CloseIcon, ImageIcon, TriangleLeft, TriangleRight } from "./Icons";
import TechIcon from "./TechIcon";

export default function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const { t, lang } = useI18n();
  const d = t.projects.detail;
  const panel = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const [idx, setIdx] = useState(0);

  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(
      new Date(iso)
    );

  // placeholder bila belum ada gambar
  const slots = project.images.length > 0 ? project.images : [null, null, null];

  const close = () => {
    const el = panel.current;
    if (closing.current) return;
    closing.current = true;
    if (!el) return onClose();
    animate(el, { translateY: ["0%", "100%"], duration: 550, ease: "inExpo", onComplete: onClose });
  };

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    document.body.style.overflow = "hidden";
    const anims = [
      animate(el, { translateY: ["100%", "0%"], duration: 800, ease: "outExpo" }),
      animate(el.querySelectorAll("[data-pop]"), {
        opacity: [0, 1],
        translateY: [32, 0],
        delay: stagger(80, { start: 350 }),
        duration: 700,
        ease: "outExpo",
      }),
    ];
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % slots.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + slots.length) % slots.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      anims.forEach((a) => a.revert());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const meta: [string, string][] = [
    [d.created, fmtDate(project.created)],
    [d.updated, fmtDate(project.updated)],
    [d.category, t.projects.tabs[project.category]],
    [d.status, project.status[lang]],
  ];

  return (
    <div
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
      className="fixed inset-0 z-[80] flex flex-col bg-cream"
      style={{ transform: "translateY(100%)" }}
    >
      {/* header */}
      <div className="flex shrink-0 items-center justify-between gap-4 bg-black px-4 py-3 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="h-3 w-3 shrink-0 rounded-full bg-sun" />
          <h3 className="truncate font-sans text-lg font-bold text-white sm:text-2xl">{project.name}</h3>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label={d.close}
          className="flex h-10 w-10 shrink-0 items-center justify-center bg-sun text-black transition-transform hover:rotate-90"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      {/* isi (scroll) */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-6 sm:px-8 lg:grid-cols-[1.25fr_1fr] lg:py-10">
          {/* galeri */}
          <div data-pop style={{ opacity: 0 }}>
            <p className="mb-2 font-mono text-[11px] font-bold uppercase">{d.gallery}</p>
            <div className="relative aspect-video overflow-hidden bg-[#d6d6d6]">
              {slots[idx] ? (
                <img src={slots[idx] as string} alt={`${project.name} ${idx + 1}`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#7a7a7a]">
                  <ImageIcon className="h-16 w-16" />
                  <span className="px-4 text-center font-mono text-[11px]">{d.noImages}</span>
                </div>
              )}
              {slots.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setIdx((i) => (i - 1 + slots.length) % slots.length)}
                    aria-label={d.prev}
                    className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-white shadow-card transition-transform hover:-translate-x-0.5"
                  >
                    <TriangleLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdx((i) => (i + 1) % slots.length)}
                    aria-label={d.next}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-white shadow-card transition-transform hover:translate-x-0.5"
                  >
                    <TriangleRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
            {slots.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                {slots.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIdx(i)}
                    aria-label={`${project.name} ${i + 1}`}
                    aria-current={i === idx}
                    className={`relative aspect-video overflow-hidden bg-[#d6d6d6] outline-offset-2 transition-all ${
                      i === idx ? "outline outline-[3px] outline-black" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    {s ? (
                      <img src={s} alt="" loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-[#7a7a7a]">
                        <ImageIcon className="h-6 w-6" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* info */}
          <div className="space-y-6">
            <section data-pop style={{ opacity: 0 }}>
              <h4 className="inline-block bg-black px-2 py-0.5 font-sans text-sm font-bold text-white">{d.about}</h4>
              <p className="mt-3 font-mono text-xs leading-relaxed text-neutral-800">{project.longDesc[lang]}</p>
            </section>

            <section data-pop style={{ opacity: 0 }}>
              <h4 className="inline-block bg-sky px-2 py-0.5 font-sans text-sm font-bold text-black">{d.highlights}</h4>
              <ul className="mt-3 space-y-1.5 font-mono text-xs text-neutral-800">
                {project.highlights[lang].map((h) => (
                  <li key={h} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 shrink-0 bg-sun" />
                    {h}
                  </li>
                ))}
              </ul>
            </section>

            <section data-pop style={{ opacity: 0 }}>
              <h4 className="inline-block bg-sun px-2 py-0.5 font-sans text-sm font-bold text-black">{d.stack}</h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.tech.map((k) => (
                  <li
                    key={k}
                    className="flex items-center gap-2 bg-white px-2.5 py-1.5 font-mono text-[11px] font-bold shadow-card"
                  >
                    <TechIcon tech={k} className="h-4 w-4" />
                    {techLabels[k]}
                  </li>
                ))}
              </ul>
            </section>

            <dl data-pop style={{ opacity: 0 }} className="grid grid-cols-2 gap-px bg-black/15">
              {meta.map(([k, v]) => (
                <div key={k} className="bg-cream p-3">
                  <dt className="font-mono text-[10px] text-neutral-600">{k}</dt>
                  <dd className="mt-1 font-sans text-sm font-bold">{v}</dd>
                </div>
              ))}
            </dl>

            {(project.links?.live || project.links?.repo) && (
              <div data-pop style={{ opacity: 0 }} className="flex flex-wrap gap-3">
                {project.links?.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black px-4 py-2.5 font-mono text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
                  >
                    {d.live}
                  </a>
                )}
                {project.links?.repo && (
                  <a
                    href={project.links.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-sun px-4 py-2.5 font-mono text-xs font-bold text-black transition-transform hover:-translate-y-0.5"
                  >
                    {d.source}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
