import { Tech } from "@/lib/projects";
import { Html5Icon, ReactIcon } from "./Icons";

const BADGE: Record<Exclude<Tech, "react" | "html">, string> = {
  css: "CSS",
  js: "JS",
  ts: "TS",
  next: "N",
  tailwind: "TW",
  supabase: "SB",
  node: "JS",
  godot: "G",
  unity: "U",
  unreal: "UE",
  gamemaker: "GM",
  construct3: "C3",
  python: "Py",
  java: "Ja",
  csharp: "C#",
  cpp: "C++",
  c: "C",
  go: "Go",
  rust: "Rs",
  php: "PHP",
  ruby: "Rb",
  swift: "Sw",
  kotlin: "Kt",
  lua: "Lua",
  dart: "D",
  gdscript: "GDS",
  sql: "SQL",
  bash: "Sh",
  r: "R",
};

export default function TechIcon({ tech, className = "h-5 w-5" }: { tech: Tech; className?: string }) {
  if (tech === "react") return <ReactIcon className={className} />;
  if (tech === "html") return <Html5Icon className={className} />;
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[3px] bg-current font-mono text-[8px] font-bold leading-none ${className}`}
    >
      <span className={`text-white ${BADGE[tech].length > 2 ? "text-[6px]" : ""}`}>{BADGE[tech]}</span>
    </span>
  );
}
