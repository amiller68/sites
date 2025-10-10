import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { leakyClient } from "@/lib/leaky/client";
import { formatDistance } from "date-fns";

// Enable ISR with 60 second revalidation
export const revalidate = 60;

interface GalleryItemPageProps {
  params: Promise<{ path: string[] }>;
}

export async function generateMetadata({
  params,
}: GalleryItemPageProps): Promise<Metadata> {
  const { path } = await params;
  const imagePath = path.join("/");

  return {
    title: `Gallery - ${imagePath.split("/").pop()}`,
    description: `View ${imagePath} in the gallery`,
  };
}

export default async function GalleryItemPage({
  params,
}: GalleryItemPageProps) {
  const { path } = await params;
  const imagePath = path.join("/");

  // Get all images to find this one
  const images = await leakyClient.gallery.list();
  const image = images.find((img) => img.name === imagePath);

  if (!image) {
    return notFound();
  }

  const filename = imagePath.split("/").pop() || imagePath;
  const category = imagePath.includes("/")
    ? imagePath.substring(0, imagePath.lastIndexOf("/"))
    : "";

  return (
    <div className="flex justify-center py-12">
      <div className="max-w-6xl w-full">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          back to gallery
        </Link>

        <div className="space-y-6">
          {/* Image metadata */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{filename}</h1>
            {category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                {category}
              </span>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              {formatDistance(new Date(image.created_at), new Date(), {
                addSuffix: true,
              })}
            </p>
          </div>

          {/* Full size image */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-muted">
            <Image
              src={leakyClient.gallery.getUrl(image.name)}
              alt={filename}
              width={1200}
              height={1200}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
