"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useAudio } from "../../audio-context";
import {
  PlayIcon,
  PauseIcon,
  PrintIcon,
  QrCodeIcon,
  ScrollIcon,
} from "../../icons";

type Track = { name: string; url: string };
type SongMeta = {
  key?: string;
  tempo?: number;
  capo?: number;
  tuning?: string;
};

const SCROLL_MIN = 0.3;
const SCROLL_MAX = 5;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function SongSheet({
  html,
  track,
  slug,
  title,
  meta,
  autoPlay,
}: {
  html: string;
  track?: Track;
  slug: string;
  title: string;
  meta: SongMeta;
  autoPlay?: boolean;
}) {
  const { track: currentTrack, playing, playQueue, toggle } = useAudio();
  const isThisTrack = currentTrack?.url === track?.url;
  const isPlaying = isThisTrack && playing;
  const didAutoPlay = useRef(false);

  const [showQr, setShowQr] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (autoPlay && track && !didAutoPlay.current && !isThisTrack) {
      didAutoPlay.current = true;
      playQueue([track]);
    }
  }, [autoPlay, track, isThisTrack, playQueue]);

  const songUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/songs/${slug}`
      : "";

  const handlePrint = useCallback(() => {
    const metaParts = [
      meta.key && `key: ${meta.key}`,
      meta.tempo && `${meta.tempo} bpm`,
      meta.capo && `capo ${meta.capo}`,
      meta.tuning && `tuning: ${meta.tuning}`,
    ].filter(Boolean);

    const w = window.open("", "_blank");
    if (!w) return;
    const safeTitle = escapeHtml(title);
    const safeMeta = metaParts.map((p) => escapeHtml(p as string));
    w.document.write(`<!DOCTYPE html>
<html><head><title>${safeTitle}</title>
<style>
  body { font-family: "Times New Roman", Times, serif; font-size: 14px; line-height: 1.7; padding: 2rem; max-width: 700px; }
  h1 { font-size: 24px; margin: 0 0 4px; }
  .meta { font-size: 13px; color: #666; margin-bottom: 1.5rem; }
  .song-sheet { font-family: monospace; font-size: 13px; line-height: 1.6; }
  .song-sheet table.row { border-collapse: collapse; margin-bottom: 0.25rem; }
  .song-sheet .chord { font-weight: 700; white-space: pre; padding: 0; }
  .song-sheet .lyrics { white-space: pre; padding: 0; }
  .song-sheet .comment { color: #666; font-style: italic; margin-top: 1.5rem; margin-bottom: 0.5rem; }
  .song-sheet .paragraph { margin-bottom: 1rem; }
  .song-sheet .literal { white-space: pre; }
  .song-sheet .paragraph.tab { background: #f5f5f5; padding: 0.75rem 1rem; overflow-x: auto; margin: 0.5rem 0; }
</style>
</head><body>
<h1>${safeTitle}</h1>
${safeMeta.length ? `<div class="meta">${safeMeta.join(" &middot; ")}</div>` : ""}
<div class="song-sheet">${html}</div>
</body></html>`);
    w.document.close();
    w.print();
  }, [title, meta, html]);

  useEffect(() => {
    if (!showQr) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowQr(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showQr]);

  useEffect(() => {
    if (!scrolling) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    let last = performance.now();
    const step = (now: number) => {
      const delta = now - last;
      last = now;
      window.scrollBy(0, scrollSpeed * (delta / 16));
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafRef.current);
  }, [scrolling, scrollSpeed]);

  const btnClass =
    "p-2 border border-border text-muted-foreground hover:text-foreground transition-colors";
  const btnActiveClass =
    "p-2 border border-border bg-foreground text-background";

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 print:hidden">
        {track && (
          <button
            onClick={() => (isThisTrack ? toggle() : playQueue([track]))}
            className={isPlaying ? btnActiveClass : btnClass}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
          </button>
        )}
        <button onClick={handlePrint} className={btnClass} title="Print">
          <PrintIcon size={14} />
        </button>
        <button
          onClick={() => setShowQr((v) => !v)}
          className={showQr ? btnActiveClass : btnClass}
          title="QR Code"
        >
          <QrCodeIcon size={14} />
        </button>
        <button
          onClick={() => {
            const next = !showScroll;
            setShowScroll(next);
            if (next) setScrolling(true);
            if (!next) setScrolling(false);
          }}
          className={showScroll ? btnActiveClass : btnClass}
          title="Auto-scroll"
        >
          <ScrollIcon size={14} />
        </button>
      </div>

      {showQr && songUrl && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 print:hidden cursor-pointer"
          onClick={() => setShowQr(false)}
        >
          <QRCodeSVG
            value={songUrl}
            size={280}
            bgColor="transparent"
            fgColor="currentColor"
          />
          <p className="mt-4 text-sm text-muted-foreground">{songUrl}</p>
        </div>
      )}

      {showScroll && (
        <div className="fixed bottom-24 right-6 z-40 flex items-center gap-3 px-3 py-2 bg-foreground text-background border border-border shadow-lg text-sm">
          <button
            onClick={() => setScrolling((v) => !v)}
            title={scrolling ? "Pause" : "Play"}
          >
            {scrolling ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
          </button>
          <input
            type="range"
            min={SCROLL_MIN}
            max={SCROLL_MAX}
            step={0.1}
            value={scrollSpeed}
            onChange={(e) => setScrollSpeed(Number(e.target.value))}
            className="w-24 accent-current"
          />
        </div>
      )}

      <div
        className="song-sheet font-mono text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
