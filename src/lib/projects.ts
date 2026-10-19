export type Category = "websites" | "desktop" | "games" | "mobile";
export type Tech = "react" | "html" | "css" | "js" | "ts" | "next" | "tailwind" | "supabase" | "node";

export const techLabels: Record<Tech, string> = {
  react: "React",
  html: "HTML5",
  css: "CSS3",
  js: "JavaScript",
  ts: "TypeScript",
  next: "Next.js",
  tailwind: "Tailwind CSS",
  supabase: "Supabase",
  node: "Node.js",
};

interface Bi<T = string> {
  en: T;
  id: T;
}

export interface Project {
  id: string;
  category: Category;
  name: string;
  desc: Bi; // teks singkat di kartu
  longDesc: Bi; // teks lengkap di popup
  highlights: Bi<string[]>;
  status: Bi;
  created: string; // ISO date
  updated: string; // ISO date
  tech: Tech[];
  images: string[]; // gambar showcase di popup, contoh ["/images/projects/cashflow-1.jpg"]
  links?: { live?: string; repo?: string };
}

const desc: Bi = {
  en: "Money management app, that simplifies bla bla bla.",
  id: "Aplikasi manajemen uang yang menyederhanakan bla bla bla.",
};

const longDesc: Bi = {
  en: "Replace this text with a full description of the project: what problem it solves, who it is for, and what your role was. Add your own screenshots to the images list to show them in the gallery.",
  id: "Ganti teks ini dengan deskripsi lengkap proyek: masalah yang diselesaikan, untuk siapa, dan apa peranmu. Tambahkan screenshot sendiri ke daftar images agar tampil di galeri.",
};

const highlights: Bi<string[]> = {
  en: ["Key feature number one", "Key feature number two", "Key feature number three"],
  id: ["Fitur utama pertama", "Fitur utama kedua", "Fitur utama ketiga"],
};

const status: Bi = { en: "In progress", id: "Sedang dikerjakan" };

const make = (category: Category, names: string[]): Project[] =>
  names.map((name, i) => ({
    id: `${category}-${i}`,
    category,
    name,
    desc,
    longDesc,
    highlights,
    status,
    created: "2026-08-01",
    updated: "2026-10-12",
    tech: ["react", "html", "css", "js"],
    images: [],
  }));

// GANTI data placeholder ini dengan proyek aslimu.
export const projects: Project[] = [
  ...make("websites", ["CashFlow", "Name 2", "Name 3", "Name 4", "Name 5"]),
  ...make("desktop", ["Name 1", "Name 2", "Name 3", "Name 4"]),
  ...make("games", ["Name 1", "Name 2", "Name 3", "Name 4"]),
  ...make("mobile", ["Name 1", "Name 2", "Name 3", "Name 4"]),
];

export const marqueeItems = [
  "HTML5",
  "CSS3",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "Supabase",
  "Git",
];
