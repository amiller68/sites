import { TypingHeader } from "@repo/ui";
import { leakyClient } from "@/lib/leaky/client";
import { formatDistance } from "date-fns";
import { AudioPlayer } from "../components/audio-player";

// Enable ISR with 60 second revalidation
export const revalidate = 60;

export default async function MusicPage() {
  const tracks = await leakyClient.music.list();

  return (
    <div className="flex justify-center items-start min-h-[80vh] py-12">
      <div className="max-w-3xl w-full">
        <TypingHeader text="> music" size="text-4xl" />

        {tracks.length === 0 ? (
          <p className="mt-8 text-muted-foreground">no tracks yet...</p>
        ) : (
          <div className="mt-8 space-y-4">
            {tracks.map((track) => (
              <div
                key={track.name}
                className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="mb-3">
                  <h3 className="font-medium text-foreground">
                    {track.name
                      .split("/")
                      .pop()
                      ?.replace(/\.[^/.]+$/, "")}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistance(new Date(track.created_at), new Date(), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <AudioPlayer
                  src={leakyClient.music.getUrl(track.name)}
                  title={
                    track.name
                      .split("/")
                      .pop()
                      ?.replace(/\.[^/.]+$/, "") || ""
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
