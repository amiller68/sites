"use client";

import { useCallback, useMemo, useState } from "react";
import { useAudio } from "./audio-context";
import { PlayIcon, PauseIcon, ShuffleIcon, DownloadIcon } from "./icons";

type TaggedTrack = {
  name: string;
  path: string;
  tag: string;
  url: string;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function TrackList({ tracks }: { tracks: TaggedTrack[] }) {
  const {
    track: currentTrack,
    queue,
    playing,
    playQueue,
    replaceQueue,
    toggle,
  } = useAudio();
  const [shuffleOn, setShuffleOn] = useState(false);

  const queueTracks = useMemo(
    () => tracks.map((t) => ({ name: t.name, url: t.url })),
    [tracks],
  );

  const isPlayingFromList = tracks.some((t) => t.url === currentTrack?.url);

  const handlePlayAll = useCallback(() => {
    if (isPlayingFromList) {
      toggle();
    } else {
      setShuffleOn(false);
      playQueue(queueTracks);
    }
  }, [isPlayingFromList, toggle, playQueue, queueTracks]);

  const handleShuffle = useCallback(() => {
    if (shuffleOn) {
      setShuffleOn(false);
      if (isPlayingFromList && currentTrack) {
        const idx = queueTracks.findIndex((t) => t.url === currentTrack.url);
        replaceQueue(idx >= 0 ? queueTracks.slice(idx) : queueTracks);
      } else {
        playQueue(queueTracks);
      }
    } else {
      setShuffleOn(true);
      if (isPlayingFromList && currentTrack) {
        const rest = queueTracks.filter((t) => t.url !== currentTrack.url);
        replaceQueue([currentTrack, ...shuffle(rest)]);
      } else {
        playQueue(shuffle(queueTracks));
      }
    }
  }, [
    shuffleOn,
    isPlayingFromList,
    currentTrack,
    playQueue,
    replaceQueue,
    queueTracks,
  ]);

  const handleTrackClick = useCallback(
    (clickedTrack: TaggedTrack) => {
      if (currentTrack?.url === clickedTrack.url) {
        toggle();
      } else {
        const idx = tracks.indexOf(clickedTrack);
        const source = shuffleOn ? shuffle(queueTracks) : queueTracks;
        if (shuffleOn) {
          // Put clicked track first, shuffle the rest
          const rest = source.filter((t) => t.url !== clickedTrack.url);
          playQueue(
            [{ name: clickedTrack.name, url: clickedTrack.url }, ...rest],
            0,
          );
        } else {
          playQueue(queueTracks, idx);
        }
      }
    },
    [currentTrack, tracks, queueTracks, shuffleOn, toggle, playQueue],
  );

  // Detect if our queue is active
  const isOurQueue =
    isPlayingFromList &&
    queue.length > 0 &&
    queue.some((q) => tracks.some((t) => t.url === q.url));

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={handlePlayAll}
          className={`flex items-center gap-1.5 text-sm px-3 py-1 border border-border transition-colors ${
            isOurQueue && playing
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {isOurQueue && playing ? (
            <PauseIcon size={14} />
          ) : (
            <PlayIcon size={14} />
          )}
        </button>
        <button
          onClick={handleShuffle}
          className={`flex items-center gap-1.5 text-sm px-3 py-1 border border-border transition-colors ${
            shuffleOn
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShuffleIcon size={14} />
        </button>
      </div>

      <div>
        {tracks.map((track) => {
          const isPlaying = currentTrack?.url === track.url;
          const isActive = isPlaying && playing;

          return (
            <div
              key={track.path}
              className={`group flex items-center gap-4 py-2 px-3 border-b border-border cursor-pointer ${
                isPlaying ? "bg-accent" : ""
              }`}
              onClick={() => handleTrackClick(track)}
            >
              <span className="w-5 text-center text-muted-foreground shrink-0">
                {isActive ? (
                  <PlayIcon size={12} />
                ) : isPlaying ? (
                  <PauseIcon size={12} />
                ) : (
                  ""
                )}
              </span>

              <span className="flex-1">{track.name}</span>

              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                {track.tag}
              </span>

              <a
                href={track.url}
                download
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                title="Download"
              >
                <DownloadIcon size={14} />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
