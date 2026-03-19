"use client";

import Image from "next/image";
import { useState, useCallback } from "react";

type Photo = {
  url: string;
  name: string;
};

// Deterministic hash from filename
function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = ((h << 5) - h + name.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Deterministic float 0-1 from name + seed
function seeded(name: string, seed: number): number {
  return (hashName(name + seed) % 1000) / 1000;
}

function photoStyle(name: string) {
  const rotation = (seeded(name, 1) - 0.5) * 8; // -4 to 4 degrees
  const scale = 0.85 + seeded(name, 2) * 0.3; // 0.85 to 1.15
  const offsetX = (seeded(name, 3) - 0.5) * 20; // -10 to 10px
  const offsetY = (seeded(name, 4) - 0.5) * 16; // -8 to 8px

  return {
    transform: `rotate(${rotation}deg) scale(${scale}) translate(${offsetX}px, ${offsetY}px)`,
  };
}

function aspectFromName(name: string): string {
  const h = hashName(name) % 4;
  if (h === 0) return "aspect-[4/3]";
  if (h === 1) return "aspect-[3/4]";
  if (h === 2) return "aspect-square";
  return "aspect-[3/2]";
}

function spanFromName(name: string): string {
  const h = hashName(name) % 6;
  if (h === 0) return "col-span-2";
  return "col-span-1";
}

export function Gallery({ photos }: { photos: Photo[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  const close = useCallback(() => setSelected(null), []);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      if (!selected) return;
      const idx = photos.findIndex((p) => p.url === selected);
      const next = (idx + dir + photos.length) % photos.length;
      setSelected(photos[next].url);
    },
    [selected, photos],
  );

  return (
    <>
      <div className="grid grid-cols-3 gap-2 -mx-4">
        {photos.map((photo) => {
          const span = spanFromName(photo.name);
          const aspect = aspectFromName(photo.name);

          return (
            <div
              key={photo.url}
              className={`cursor-pointer overflow-visible ${span} -m-1`}
              onClick={() => setSelected(photo.url)}
            >
              <div
                className={`relative w-full ${aspect} transition-transform duration-300 hover:scale-105 hover:z-10`}
                style={photoStyle(photo.name)}
              >
                <Image
                  src={photo.url}
                  alt=""
                  fill
                  className="object-cover shadow-md"
                  loading="lazy"
                  unoptimized
                />
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={close}
        >
          <button
            className="absolute top-6 right-6 text-white text-2xl"
            onClick={close}
          >
            &times;
          </button>
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-3xl"
            onClick={(e) => {
              e.stopPropagation();
              navigate(-1);
            }}
          >
            &lsaquo;
          </button>
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-3xl"
            onClick={(e) => {
              e.stopPropagation();
              navigate(1);
            }}
          >
            &rsaquo;
          </button>
          <Image
            src={selected}
            alt=""
            width={1200}
            height={900}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            unoptimized
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
