"use client";

import { useCallback, useState, useEffect } from "react";
import { useAudio } from "./audio-context";

type TaggedTrack = {
  name: string;
  path: string;
  tag: string;
  url: string;
};

function pickRandom<T>(arr: T[], exclude?: T): T {
  if (arr.length <= 1) return arr[0];
  let pick: T;
  do {
    pick = arr[Math.floor(Math.random() * arr.length)];
  } while (pick === exclude && arr.length > 1);
  return pick;
}

export function TrackList({ tracks }: { tracks: TaggedTrack[] }) {
  const { track: currentTrack, playing, play, onEnded } = useAudio();
  const [shuffleOn, setShuffleOn] = useState(false);

  const playNext = useCallback(() => {
    if (tracks.length === 0) return;
    if (shuffleOn) {
      const next = pickRandom(
        tracks,
        tracks.find((t) => t.url === currentTrack?.url),
      );
      play({ name: next.name, url: next.url });
    } else {
      const idx = tracks.findIndex((t) => t.url === currentTrack?.url);
      const next = tracks[(idx + 1) % tracks.length];
      play({ name: next.name, url: next.url });
    }
  }, [shuffleOn, tracks, currentTrack, play]);

  useEffect(() => {
    onEnded(playNext);
  }, [onEnded, playNext]);

  const startShuffle = useCallback(() => {
    setShuffleOn(true);
    const track = pickRandom(tracks);
    if (track) play({ name: track.name, url: track.url });
  }, [tracks, play]);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={shuffleOn ? () => setShuffleOn(false) : startShuffle}
          className={`text-sm px-3 py-1 border border-border transition-colors ${
            shuffleOn
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          shuffle
        </button>
      </div>

      <div>
        {tracks.map((track) => {
          const isPlaying = currentTrack?.url === track.url;
          const isActive = isPlaying && playing;

          return (
            <div
              key={track.path}
              className={`group flex items-center gap-4 py-2 border-b border-border cursor-pointer ${
                isPlaying ? "bg-accent" : ""
              }`}
              onClick={() => play({ name: track.name, url: track.url })}
            >
              <span className="w-5 text-center text-muted-foreground shrink-0">
                {isActive ? "▶" : isPlaying ? "||" : ""}
              </span>

              <span className="flex-1">{track.name}</span>

              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                {track.tag}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
