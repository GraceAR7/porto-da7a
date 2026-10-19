"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "en" | "id";

const en = {
  nav: { about: "About", projects: "Projects", contacts: "Contacts", contactMe: "Contact Me", menu: "Menu", close: "Close" },
  hero: {
    badge: "INDEPENDENT DEVELOPER & CREATIVE DESIGNER",
    title1: "TURNING IDEAS INTO SOMETHING",
    title2: "EXTRAORDINARY.",
    desc: "Turning creative ideas into functional digital experiences through code, design, and experimentation. From building applications to exploring new possibilities, I enjoy bringing ideas to life, one project at a time.",
  },
  intro: {
    title1: "A LITTLE INTRODUCTION",
    title2: "FROM ME :",
    caption1: "A short video about",
    caption2: ":D",
    like: "Like",
    socials: "Also, don't forget to check out my socials!",
    tip: { linkedin: "Check out my LinkedIn!", youtube: "Watch my YouTube channel!", itch: "Play my games on itch.io!" },
    play: "Play video",
    pause: "Pause video",
    mute: "Mute",
    unmute: "Unmute",
    fullscreen: "Fullscreen",
  },
  about: {
    label: "About",
    prev: "Previous slide",
    next: "Next slide",
    slides: [
      {
        title: "What's “Da7A”?",
        body: "**Da7A** is my personal studio: a place where I build **websites, apps and games**, and sketch in between. Every project starts as a messy desk, a pen and a lot of code, then turns into something that works and feels fun to use.",
      },
      {
        title: "Who's “Da7A”?",
        body: "I'm **Grace**, an independent developer and creative designer. I love turning ideas into **functional digital experiences** through code, design, and experimentation, one project at a time.",
      },
      {
        title: "Why “Da7A”?",
        body: "The name **'Da7A'** is a stylized play on 'The 7A' combining my lucky number with a personal reminder to always aim for **A-grade quality** in everything I create. I also made the logo from scratch, I custom-drew the characters to fit this shield shape, hiding playful little doodles inside the bold black letters to reflect my blend of **technical structure** and **creative fun**.",
      },
    ],
  },
  projects: {
    title: "PROJECTS",
    tabs: { websites: "Websites", desktop: "Desktop Apps", games: "Games", mobile: "Mobile Apps" },
    lastUpdated: "Last Updated:",
    next: "Scroll projects",
    detail: {
      close: "Close",
      about: "About this project",
      highlights: "Highlights",
      stack: "Tech stack",
      gallery: "Showcase",
      created: "Created",
      updated: "Last updated",
      category: "Category",
      status: "Status",
      live: "Visit project",
      source: "Source code",
      prev: "Previous image",
      next: "Next image",
      noImages: "Project images will appear here.",
      open: "View details",
    },
  },
  contact: {
    title1: "INTERESTED IN COLLAB?",
    title2: "CONTACT ME TODAY.",
    desc: "Let's build something awesome together. Fill out the form below and I'll get back to you as soon as possible.",
    firstName: "First Name",
    lastName: "Last Name",
    firstPh: "e.g. John",
    lastPh: "e.g. Doe",
    email: "Email Address",
    emailPh: "e.g. youremail@gmail.com",
    message: "Your Message",
    messagePh: "Enter your question or message here...",
    submit: "SUBMIT",
    thanks: "Your email app should open now. Thank you!",
  },
  footer: { rights: "All rights reserved." },
};

export type Dict = typeof en;

const id: Dict = {
  nav: { about: "Tentang", projects: "Proyek", contacts: "Kontak", contactMe: "Hubungi Saya", menu: "Menu", close: "Tutup" },
  hero: {
    badge: "DEVELOPER INDEPENDEN & DESAINER KREATIF",
    title1: "MENGUBAH IDE MENJADI SESUATU",
    title2: "LUAR BIASA.",
    desc: "Mengubah ide kreatif menjadi pengalaman digital yang fungsional melalui kode, desain, dan eksperimen. Dari membangun aplikasi hingga menjelajahi kemungkinan baru, saya senang menghidupkan ide, satu proyek dalam satu waktu.",
  },
  intro: {
    title1: "SEDIKIT PERKENALAN",
    title2: "DARI SAYA :",
    caption1: "Video singkat tentang",
    caption2: ":D",
    like: "Suka",
    socials: "Jangan lupa juga cek sosial media saya!",
    tip: { linkedin: "Lihat LinkedIn saya!", youtube: "Tonton channel YouTube saya!", itch: "Mainkan game saya di itch.io!" },
    play: "Putar video",
    pause: "Jeda video",
    mute: "Bisukan",
    unmute: "Suarakan",
    fullscreen: "Layar penuh",
  },
  about: {
    label: "Tentang",
    prev: "Slide sebelumnya",
    next: "Slide berikutnya",
    slides: [
      {
        title: "Apa itu “Da7A”?",
        body: "**Da7A** adalah studio pribadiku: tempat aku membangun **website, aplikasi, dan game**, sambil sesekali menggambar. Setiap proyek dimulai dari meja berantakan, sebuah pena, dan banyak kode, lalu menjadi sesuatu yang berfungsi dan menyenangkan dipakai.",
      },
      {
        title: "Siapa “Da7A”?",
        body: "Aku **Grace**, developer independen dan desainer kreatif. Aku suka mengubah ide menjadi **pengalaman digital yang fungsional** lewat kode, desain, dan eksperimen, satu proyek dalam satu waktu.",
      },
      {
        title: "Kenapa “Da7A”?",
        body: "Nama **'Da7A'** adalah permainan gaya dari 'The 7A', menggabungkan angka keberuntunganku dengan pengingat pribadi untuk selalu mengejar **kualitas nilai A** dalam segala yang kubuat. Logonya juga kubuat dari nol, karakternya kugambar khusus agar pas dengan bentuk perisai ini, dengan doodle kecil yang jahil tersembunyi di dalam huruf hitam tebal untuk mencerminkan perpaduan **struktur teknis** dan **kreativitas yang menyenangkan**.",
      },
    ],
  },
  projects: {
    title: "PROYEK",
    tabs: { websites: "Website", desktop: "Aplikasi Desktop", games: "Game", mobile: "Aplikasi Mobile" },
    lastUpdated: "Terakhir Diperbarui:",
    next: "Geser proyek",
    detail: {
      close: "Tutup",
      about: "Tentang proyek ini",
      highlights: "Sorotan",
      stack: "Teknologi",
      gallery: "Showcase",
      created: "Dibuat",
      updated: "Terakhir diperbarui",
      category: "Kategori",
      status: "Status",
      live: "Kunjungi proyek",
      source: "Kode sumber",
      prev: "Gambar sebelumnya",
      next: "Gambar berikutnya",
      noImages: "Gambar proyek akan muncul di sini.",
      open: "Lihat detail",
    },
  },
  contact: {
    title1: "TERTARIK KOLABORASI?",
    title2: "HUBUNGI SAYA SEKARANG.",
    desc: "Mari membangun sesuatu yang keren bersama. Isi formulir di bawah ini dan saya akan membalas secepat mungkin.",
    firstName: "Nama Depan",
    lastName: "Nama Belakang",
    firstPh: "cth. Budi",
    lastPh: "cth. Santoso",
    email: "Alamat Email",
    emailPh: "cth. emailanda@gmail.com",
    message: "Pesan Anda",
    messagePh: "Tulis pertanyaan atau pesan Anda di sini...",
    submit: "KIRIM",
    thanks: "Aplikasi email Anda akan terbuka. Terima kasih!",
  },
  footer: { rights: "Hak cipta dilindungi." },
};

const dicts: Record<Lang, Dict> = { en, id };

interface Ctx {
  lang: Lang;
  t: Dict;
  setLang: (l: Lang) => void;
}

const I18nContext = createContext<Ctx>({ lang: "en", t: en, setLang: () => {} });

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("da7a-lang");
      if (saved === "en" || saved === "id") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("da7a-lang", l);
    } catch {}
  }, []);

  const value = useMemo(() => ({ lang, t: dicts[lang], setLang }), [lang, setLang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);

// Render teks dengan **tebal**
export function renderBold(text: string) {
  return text.split("**").map((part, i) => (i % 2 === 1 ? <b key={i}>{part}</b> : <span key={i}>{part}</span>));
}
