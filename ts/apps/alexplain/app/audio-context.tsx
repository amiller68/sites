"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";

type Track = {
  name: string;
  url: string;
};

type AudioState = {
  track: Track | null;
  playing: boolean;
  currentTime: number;
  duration: number;
};

type AudioActions = {
  play: (track: Track) => void;
  toggle: () => void;
  seek: (pct: number) => void;
  stop: () => void;
  onEnded: (cb: () => void) => void;
};

type AudioContextValue = AudioState & AudioActions;

const Ctx = createContext<AudioContextValue | null>(null);

export function useAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be inside AudioProvider");
  return ctx;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const endedCbRef = useRef<(() => void) | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const play = useCallback(
    (t: Track) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (track?.url === t.url) {
        if (audio.paused) {
          audio.play();
        } else {
          audio.pause();
        }
        return;
      }

      audio.src = t.url;
      audio.play();
      setTrack(t);
      setCurrentTime(0);
      setDuration(0);
    },
    [track],
  );

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [track]);

  const seek = useCallback(
    (pct: number) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;
      audio.currentTime = pct * duration;
    },
    [duration],
  );

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = "";
    }
    setTrack(null);
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const onEnded = useCallback((cb: () => void) => {
    endedCbRef.current = cb;
  }, []);

  // Sync playing state with audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  return (
    <Ctx.Provider
      value={{
        track,
        playing,
        currentTime,
        duration,
        play,
        toggle,
        seek,
        stop,
        onEnded,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        preload="none"
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => {
          if (endedCbRef.current) {
            endedCbRef.current();
          } else {
            stop();
          }
        }}
      />
    </Ctx.Provider>
  );
}
