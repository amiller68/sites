import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { leakyClient } from "@/lib/leaky/client";
import { formatDistance } from "date-fns";

// Enable ISR with 60 second revalidation
export const revalidate = 60;

interface NotePageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const { category, slug } = await params;

  const post = await leakyClient.blog.get(category, slug);

  if (!post) {
    return {
      title: "Note Not Found",
      description: "The requested note could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function NoteDetailPage({ params }: NotePageProps) {
  const { category, slug } = await params;

  const post = await leakyClient.blog.get(category, slug);

  if (!post) {
    return notFound();
  }

  return (
    <div className="flex justify-center py-12">
      <div className="max-w-3xl w-full">
        <Link
          href="/notes"
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
          back to notes
        </Link>

        <article>
          {/* Header */}
          <header className="mb-12">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                {post.category}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatDistance(new Date(post.created_at), new Date(), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {post.title}
            </h1>

            {post.description && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {post.description}
              </p>
            )}
          </header>

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
        </article>
      </div>
    </div>
  );
}
