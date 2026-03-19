"use client";

import { useAudio } from "./audio-context";
import { PlayIcon, PauseIcon } from "./icons";

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function NowPlaying() {
  const { track, queue, playing, currentTime, duration, toggle, seek, stop } =
    useAudio();
  if (!track) return null;

  const currentIdx = queue.findIndex((t) => t.url === track.url);
  const remaining = currentIdx >= 0 ? queue.length - currentIdx - 1 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border">
      {duration > 0 && (
        <div
          className="h-2 bg-muted cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            seek(pct);
          }}
        >
          <div
            className="h-full bg-foreground transition-[width] duration-100 pointer-events-none"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
      )}
      <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-4">
        <button
          onClick={toggle}
          className="w-8 h-8 flex items-center justify-center shrink-0"
        >
          {playing ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
        </button>
        <span className="flex-1 truncate">{track.name}</span>
        {remaining > 0 && (
          <span className="text-xs text-muted-foreground shrink-0">
            +{remaining}
          </span>
        )}
        {duration > 0 && (
          <span className="text-sm text-muted-foreground shrink-0">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        )}
        <button
          onClick={stop}
          className="text-muted-foreground hover:text-foreground text-lg shrink-0"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
