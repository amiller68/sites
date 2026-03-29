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
import type { ChordDefinition } from "@/lib/songbook";

type Track = { name: string; url: string };
type SongMeta = {
  key?: string;
  tempo?: number;
  capo?: number;
  tuning?: string;
};

const DIAGRAM_FRETS = 4;
const STRING_SP = 12;
const FRET_SP = 14;
const PAD_L = 16;
const PAD_T = 22;

function chordLayout(def: ChordDefinition) {
  const numStrings = def.frets.length;
  const numeric = def.frets.filter(
    (f): f is number => typeof f === "number" && f > 0,
  );
  const minFret = numeric.length ? Math.min(...numeric) : 1;
  const maxFret = numeric.length ? Math.max(...numeric) : 0;
  const span = maxFret - minFret;
  const baseFret =
    span < DIAGRAM_FRETS && def.baseFret > 0 ? def.baseFret : minFret;
  const numFrets = Math.max(maxFret - baseFret + 1, DIAGRAM_FRETS);
  const gw = (numStrings - 1) * STRING_SP;
  const gh = numFrets * FRET_SP;
  return { numStrings, baseFret, numFrets, gw, gh };
}

function ChordDiagram({ def }: { def: ChordDefinition }) {
  const { w, h, elements } = chordDiagramSvgParts(def, "currentColor");
  return (
    <div className="inline-flex flex-col items-center">
      <span className="text-[10px] font-bold mb-px">{def.name}</span>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        className="text-foreground"
        dangerouslySetInnerHTML={{ __html: elements }}
      />
    </div>
  );
}

const CHORD_DEFS_MARKER = "__CHORD_DEFS__";

function splitAtMarker(html: string): { before: string; after: string } | null {
  const markerIdx = html.indexOf(CHORD_DEFS_MARKER);
  if (markerIdx === -1) return null;

  const beforeIdx = html.lastIndexOf('<div class="paragraph', markerIdx);
  const closeIdx = html.indexOf("</div>", markerIdx);
  const afterIdx = closeIdx !== -1 ? closeIdx + "</div>".length : markerIdx;

  return { before: html.slice(0, beforeIdx), after: html.slice(afterIdx) };
}

function SongBody({
  html,
  chordDefinitions,
}: {
  html: string;
  chordDefinitions?: ChordDefinition[];
}) {
  const hasDefs = chordDefinitions && chordDefinitions.length > 0;
  const split = hasDefs ? splitAtMarker(html) : null;

  if (!split) {
    return (
      <div
        className="song-sheet font-mono text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className="song-sheet font-mono text-sm leading-relaxed">
      <div dangerouslySetInnerHTML={{ __html: split.before }} />
      <div className="flex flex-wrap gap-3 my-4">
        {chordDefinitions!.map((def, i) => (
          <ChordDiagram key={`${def.name}-${i}`} def={def} />
        ))}
      </div>
      <div dangerouslySetInnerHTML={{ __html: split.after }} />
    </div>
  );
}

const SCROLL_MIN = 0.3;
const SCROLL_MAX = 5;

function chordDiagramSvgParts(
  def: ChordDefinition,
  color: string,
): { w: number; h: number; elements: string } {
  const { numStrings, baseFret, numFrets, gw, gh } = chordLayout(def);
  const w = gw + PAD_L + 8;
  const h = gh + PAD_T + 10;

  const nut =
    baseFret === 1
      ? `<rect x="${PAD_L}" y="${PAD_T - 2}" width="${gw}" height="2.5" fill="${color}"/>`
      : `<text x="${PAD_L - 4}" y="${PAD_T + FRET_SP / 2 + 3}" text-anchor="end" font-size="8" fill="${color}">${baseFret}</text>`;

  const fretLines = Array.from(
    { length: numFrets + 1 },
    (_, i) =>
      `<line x1="${PAD_L}" y1="${PAD_T + i * FRET_SP}" x2="${PAD_L + gw}" y2="${PAD_T + i * FRET_SP}" stroke="${color}" stroke-width="0.5"/>`,
  ).join("");

  const stringLines = Array.from(
    { length: numStrings },
    (_, i) =>
      `<line x1="${PAD_L + i * STRING_SP}" y1="${PAD_T}" x2="${PAD_L + i * STRING_SP}" y2="${PAD_T + gh}" stroke="${color}" stroke-width="0.5"/>`,
  ).join("");

  const dots = def.frets
    .map((fret, i) => {
      const x = PAD_L + i * STRING_SP;
      if (fret === "x" || fret === -1)
        return `<text x="${x}" y="${PAD_T - 6}" text-anchor="middle" font-size="8" fill="${color}">x</text>`;
      if (fret === 0)
        return `<circle cx="${x}" cy="${PAD_T - 7}" r="3" fill="none" stroke="${color}" stroke-width="0.8"/>`;
      const y = PAD_T + (fret - baseFret) * FRET_SP + FRET_SP / 2;
      return `<circle cx="${x}" cy="${y}" r="4" fill="${color}"/>`;
    })
    .join("");

  return { w, h, elements: nut + fretLines + stringLines + dots };
}

function renderChordDiagramSvg(def: ChordDefinition): string {
  const { w, h, elements } = chordDiagramSvgParts(def, "black");
  return `<div style="display:inline-flex;flex-direction:column;align-items:center">
    <span style="font-size:10px;font-weight:bold;margin-bottom:1px">${escapeHtml(def.name)}</span>
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${elements}</svg>
  </div>`;
}

function printHtmlWithChords(html: string, defs?: ChordDefinition[]): string {
  if (!defs || defs.length === 0) return html;
  const split = splitAtMarker(html);
  if (!split) return html;

  const diagrams = `<div style="display:flex;flex-wrap:wrap;gap:12px;margin:0.5rem 0 1rem">${defs.map((d) => renderChordDiagramSvg(d)).join("")}</div>`;
  return split.before + diagrams + split.after;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function SongSheet({
  html,
  chordDefinitions,
  track,
  slug,
  title,
  meta,
  autoPlay,
}: {
  html: string;
  chordDefinitions?: ChordDefinition[];
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
<div class="song-sheet">${printHtmlWithChords(html, chordDefinitions)}</div>
</body></html>`);
    w.document.close();
    w.print();
  }, [title, meta, html, chordDefinitions]);

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

      <SongBody html={html} chordDefinitions={chordDefinitions} />
    </div>
  );
}
