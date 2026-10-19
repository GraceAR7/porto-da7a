"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";
import { HeartIcon } from "./Icons";

export default function LikeButton() {
  const { t } = useI18n();
  const [count, setCount] = useState(0);
  const [pressed, setPressed] = useState(false);
  const iconWrap = useRef<HTMLSpanElement>(null);
  const lock = useRef(false);

  const fetchCount = useCallback(async () => {
    if (!supabase) return;
    // Jumlah baris di tabel likes = jumlah like
    const { count: c, error } = await supabase.from("likes").select("id", { count: "exact", head: true });
    if (!error && c !== null) setCount(c);
  }, []);

  useEffect(() => {
    const sb = supabase;
    if (!sb) return;
    fetchCount();
    // live update via Realtime + polling cadangan
    const channel = sb
      .channel("likes-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "likes" }, () => fetchCount())
      .subscribe();
    const poll = window.setInterval(fetchCount, 20000);
    return () => {
      window.clearInterval(poll);
      sb.removeChannel(channel);
    };
  }, [fetchCount]);

  const onLike = async () => {
    if (lock.current) return;
    lock.current = true;
    window.setTimeout(() => (lock.current = false), 350);

    setPressed(true);
    setCount((c) => c + 1); // optimistic
    if (iconWrap.current) {
      animate(iconWrap.current, { scale: [1, 1.5, 1], rotate: [0, -14, 0], duration: 500, ease: "outBack" });
    }

    if (!supabase) return;
    const { error } = await supabase.from("likes").insert({});
    if (error) {
      setCount((c) => Math.max(0, c - 1));
      fetchCount();
    }
  };

  return (
    <button
      type="button"
      onClick={onLike}
      className="flex w-full items-center justify-between rounded-md bg-white px-3 py-2 font-mono text-xs font-bold text-black transition-transform active:scale-[0.99]"
      aria-label={t.intro.like}
    >
      <span className="flex items-center gap-2">
        <span ref={iconWrap} className="inline-flex">
          <HeartIcon className="h-5 w-5" filled={pressed} />
        </span>
        {t.intro.like}
      </span>
      <span className="tabular-nums">{String(count).padStart(3, "0")}</span>
    </button>
  );
}
