"use client";

import Image from "next/image";
import { useAudio } from "./audio-context";

type Release = {
  name: string;
  artUrl?: string;
  tracks: { name: string; url: string }[];
};

export function ReleaseList({ releases }: { releases: Release[] }) {
  const { track: currentTrack, playing, play } = useAudio();

  return (
    <div className="space-y-12">
      {releases.map((release) => (
        <div key={release.name}>
          <div className="flex gap-6 mb-4 items-start">
            {release.artUrl && (
              <Image
                src={release.artUrl}
                alt={`${release.name} cover`}
                width={200}
                height={200}
                className="w-44 h-44 object-cover shrink-0 border border-border"
                unoptimized
              />
            )}
            <div>
              <h2 className="text-xl mb-1">{release.name}</h2>
              <p className="text-muted-foreground">
                {release.tracks.length} track
                {release.tracks.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="space-y-px">
            {release.tracks.map((track, i) => {
              const isPlaying = currentTrack?.url === track.url;
              const isActive = isPlaying && playing;

              return (
                <div
                  key={track.url}
                  className={`group flex items-center gap-4 px-4 py-3 transition-colors cursor-pointer ${
                    isPlaying ? "bg-accent" : "hover:bg-accent/50"
                  }`}
                  onClick={() => play({ name: track.name, url: track.url })}
                >
                  <span className="w-8 text-muted-foreground shrink-0">
                    {isActive ? "▶" : isPlaying ? "||" : `${i + 1}.`}
                  </span>
                  <span
                    className={`flex-1 ${
                      isPlaying
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    {track.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
