import { photosJax } from "@/lib/jax";
import { Gallery } from "./gallery";

export const dynamic = "force-static";
export const revalidate = 3600;

type Photo = {
  url: string;
  name: string;
};

export default async function PhotosPage() {
  const listing = await photosJax.list("/", { deep: true });

  const imageExtensions = /\.(jpg|jpeg|png|webp)$/i;
  const photos: Photo[] = [];

  for (const entry of listing.entries) {
    if (entry.mime_type === "inode/directory") continue;
    if (!imageExtensions.test(entry.name)) continue;
    if (entry.name.toLowerCase() === "logo.png") continue;
    photos.push({
      url: photosJax.fileUrl(entry.path),
      name: entry.name,
    });
  }

  return (
    <div>
      <h1 className="text-2xl mb-2">photos</h1>
      <p className="text-muted-foreground mb-8">shots from around.</p>
      <Gallery photos={photos} />
    </div>
  );
}
