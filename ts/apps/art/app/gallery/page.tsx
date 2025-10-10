import { TypingHeader } from "@repo/ui";
import Image from "next/image";
import Link from "next/link";
import { leakyClient } from "@/lib/leaky/client";
import { formatDistance } from "date-fns";

// Enable ISR with 60 second revalidation
export const revalidate = 60;

export default async function GalleryPage() {
  const images = await leakyClient.gallery.list();

  return (
    <div className="flex justify-center items-start min-h-[80vh] py-12">
      <div className="max-w-7xl lg:max-w-[90rem] w-full">
        <TypingHeader text="> gallery" size="text-4xl" />

        {images.length === 0 ? (
          <p className="mt-8 text-muted-foreground">no images yet...</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {images.map((image) => (
              <Link
                key={image.name}
                href={`/gallery/${image.name}`}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-muted block"
              >
                <Image
                  src={leakyClient.gallery.getUrl(image.name, true)}
                  alt={image.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-medium truncate">
                      {image.name.split("/").pop()}
                    </p>
                    <p className="text-white/80 text-xs">
                      {formatDistance(new Date(image.created_at), new Date(), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
