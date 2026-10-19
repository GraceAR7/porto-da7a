"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { SITE } from "@/lib/config";
import { FullscreenIcon, MuteIcon, PauseIcon, PlayIcon, VolumeIcon } from "./Icons";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytPromise: Promise<any> | null = null;
function loadYT(): Promise<any> {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (!ytPromise) {
    ytPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve(window.YT);
      };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    });
  }
  return ytPromise;
}

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

export default function VideoPlayer() {
  const { t } = useI18n();
  const videoId = SITE.youtubeId;
  const frame = useRef<HTMLDivElement>(null);
  const holder = useRef<HTMLDivElement>(null);
  const player = useRef<any>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const start = useCallback(async () => {
    if (!videoId || !holder.current) return;
    if (player.current) {
      player.current.playVideo();
      return;
    }
    setStarted(true);
    const YT = await loadYT();
    const mount = document.createElement("div");
    holder.current.appendChild(mount);
    player.current = new YT.Player(mount, {
      videoId,
      width: "100%",
      height: "100%",
      playerVars: { controls: 0, modestbranding: 1, rel: 0, playsinline: 1, disablekb: 1, iv_load_policy: 3, fs: 0 },
      events: {
        onReady: (e: any) => {
          setDuration(e.target.getDuration());
          e.target.playVideo();
        },
        onStateChange: (e: any) => {
          setPlaying(e.data === 1);
          if (e.data === 1 || e.data === 2) setDuration(e.target.getDuration());
        },
      },
    });
  }, [videoId]);

  // update progress
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const p = player.current;
      if (p?.getCurrentTime) setCurrent(p.getCurrentTime());
    }, 250);
    return () => window.clearInterval(id);
  }, [playing]);

  useEffect(
    () => () => {
      try {
        player.current?.destroy?.();
      } catch {}
      player.current = null;
    },
    []
  );

  const toggle = () => {
    if (!player.current) return start();
    playing ? player.current.pauseVideo() : player.current.playVideo();
  };
  const toggleMute = () => {
    const p = player.current;
    if (!p) return;
    if (p.isMuted()) {
      p.unMute();
      setMuted(false);
    } else {
      p.mute();
      setMuted(true);
    }
  };
  const fullscreen = () => {
    const el = frame.current as any;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el);
  };

  return (
    <div
      ref={frame}
      className="group relative aspect-video w-full overflow-hidden rounded-[3px] border-[3px] border-white bg-[#3a3a3a]"
    >
      {/* poster */}
      {videoId && !started && (
        <img
          src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* iframe YouTube */}
      <div ref={holder} className="absolute inset-0 [&_iframe]:h-full [&_iframe]:w-full" />

      {/* lapisan klik (play/pause) */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? t.intro.pause : t.intro.play}
        className="absolute inset-0 flex items-center justify-center"
      >
        {!playing && (
          <span className="flex h-20 w-20 items-center justify-center transition-transform duration-300 hover:scale-110">
            <PlayIcon className="h-full w-full text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.35)]" />
          </span>
        )}
      </button>

      {/* kontrol kustom */}
      {started && (
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/85 to-transparent px-3 pb-2 pt-6 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          <button type="button" onClick={toggle} aria-label={playing ? t.intro.pause : t.intro.play}>
            {playing ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
          </button>
          <input
            type="range"
            className="yt-range h-1 flex-1 cursor-pointer"
            min={0}
            max={duration || 1}
            step={0.1}
            value={current}
            onChange={(e) => {
              const v = Number(e.target.value);
              setCurrent(v);
              player.current?.seekTo(v, true);
            }}
            aria-label="Seek"
          />
          <span className="font-mono text-[10px] tabular-nums">
            {fmt(current)} / {fmt(duration)}
          </span>
          <button type="button" onClick={toggleMute} aria-label={muted ? t.intro.unmute : t.intro.mute}>
            {muted ? <MuteIcon className="h-5 w-5" /> : <VolumeIcon className="h-5 w-5" />}
          </button>
          <button type="button" onClick={fullscreen} aria-label={t.intro.fullscreen}>
            <FullscreenIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
