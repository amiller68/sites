import { TypingHeader } from "@repo/ui";
import Link from "next/link";
import { leakyClient } from "@/lib/leaky/client";
import { formatDistance } from "date-fns";

// Enable ISR with 60 second revalidation
export const revalidate = 60;

export default async function NotesPage() {
  const posts = await leakyClient.blog.list();

  return (
    <div className="flex justify-center items-start min-h-[80vh] py-12">
      <div className="max-w-3xl w-full">
        <TypingHeader text="> creative notes" size="text-4xl" />

        {posts.length === 0 ? (
          <p className="mt-8 text-muted-foreground">no notes yet...</p>
        ) : (
          <div className="mt-8 space-y-8">
            {posts.map((post) => (
              <article
                key={`${post.category}/${post.name}`}
                className="border-b border-border pb-8 last:border-0"
              >
                <Link
                  href={`/notes/${post.category}/${post.name}`}
                  className="group block"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistance(
                            new Date(post.created_at),
                            new Date(),
                            {
                              addSuffix: true,
                            },
                          )}
                        </span>
                      </div>
                      <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {post.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
