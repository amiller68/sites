import { TypingHeader } from "@repo/ui";
import Link from "next/link";
import { quotientClient } from "@/services";
import { formatPublishDate, formatAuthorString } from "@/lib/blog";
import type { Blog } from "@/lib/quotient/types";
import { Subscribe } from "../components/subscribe";

// Force static generation
export const dynamic = "force-static";
export const revalidate = 60;

export default async function BlogPage() {
  let blogs: Blog[] = [];
  try {
    const result = await quotientClient.blog.list({
      page: 1,
      limit: 100,
      statuses: ["ACTIVE"],
    });
    blogs = result.blogs || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }

  return (
    <div className="flex justify-center items-start min-h-[80vh] py-12">
      <div className="max-w-3xl w-full">
        <TypingHeader text="> blog" size="text-4xl" />

        <div className="mt-6">
          <Subscribe />
        </div>

        {blogs.length === 0 ? (
          <p className="mt-8 text-muted-foreground">no posts yet...</p>
        ) : (
          <div className="mt-8 space-y-8">
            {blogs.map((blog) => (
              <article
                key={blog.slug}
                className="border-b border-border pb-8 last:border-0"
              >
                <Link href={`/blog/${blog.slug}`} className="group block">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                    <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                      {blog.title}
                    </h2>
                    {blog.publishDate && (
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatPublishDate(blog.publishDate)}
                      </span>
                    )}
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
