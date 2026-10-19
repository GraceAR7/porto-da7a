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
};

export default function TechIcon({ tech, className = "h-5 w-5" }: { tech: Tech; className?: string }) {
  if (tech === "react") return <ReactIcon className={className} />;
  if (tech === "html") return <Html5Icon className={className} />;
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[3px] bg-current font-mono text-[8px] font-bold leading-none ${className}`}
    >
      <span className="text-white">{BADGE[tech]}</span>
    </span>
  );
}
