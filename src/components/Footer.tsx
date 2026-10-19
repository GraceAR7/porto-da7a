"use client";

import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-white py-3 text-center font-mono text-[11px] text-neutral-700">
      © {new Date().getFullYear()} Da7A. {t.footer.rights}
    </footer>
  );
}
