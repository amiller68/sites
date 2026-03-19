import { jax } from "@/lib/jax";
import { TrackList } from "../track-list";

export const dynamic = "force-static";
export const revalidate = 3600;

export type TaggedTrack = {
  name: string;
  path: string;
  tag: string;
  url: string;
};

function formatTrackName(filename: string): string {
  return filename
    .replace(/\.(mp3|m4a|wav|ogg)$/i, "")
    .replace(/\s*-\s*\d+[!:]\d+[!:]\d+,\s*\d+\.\d+\s*(AM|PM)/gi, "");
}

function deriveTag(path: string): string | null {
  const parts = path.split("/").filter(Boolean);
  if (parts.length < 2) return null;
  return parts[0];
}

export default async function TracksPage() {
  const listing = await jax.list("/", { deep: true });

  const audioExtensions = /\.(mp3|m4a|wav|ogg)$/i;

  const tracks: TaggedTrack[] = [];
  for (const entry of listing.entries) {
    if (entry.mime_type === "inode/directory") continue;
    if (!audioExtensions.test(entry.name)) continue;
    const tag = deriveTag(entry.path);
    if (!tag || tag === "releases") continue;
    tracks.push({
      name: formatTrackName(entry.name),
      path: entry.path,
      tag,
      url: jax.fileUrl(entry.path),
    });
  }

  const tagOrder: Record<string, number> = {
    roughs: 0,
    "at-home": 1,
    jams: 2,
  };
  tracks.sort((a, b) => {
    const ao = tagOrder[a.tag] ?? 99;
    const bo = tagOrder[b.tag] ?? 99;
    if (ao !== bo) return ao - bo;
    return a.path.localeCompare(b.path);
  });

  return (
    <div>
      <h1 className="text-2xl mb-2">tracks</h1>
      <p className="text-muted-foreground mb-8">
        roughs, jams, and at-home recordings.
      </p>
      <TrackList tracks={tracks} />
    </div>
  );
}
