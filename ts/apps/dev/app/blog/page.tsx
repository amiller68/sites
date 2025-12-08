import Link from "next/link";
import { quotientClient } from "@/services";
import { formatPublishDate } from "@/lib/blog";
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
      <div className="max-w-2xl w-full">
        <h1 className="text-2xl font-medium tracking-tight">blog</h1>

        <div className="mt-6">
          <Subscribe />
        </div>

        {blogs.length === 0 ? (
          <p className="mt-8 text-muted-foreground">no posts yet...</p>
        ) : (
          <div className="mt-8 space-y-6">
            {blogs.map((blog) => (
              <article key={blog.slug}>
                <Link href={`/blog/${blog.slug}`} className="group block">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
                    <h2 className="text-base group-hover:text-foreground text-muted-foreground transition-colors">
                      {blog.title}
                    </h2>
                    {blog.publishDate && (
                      <span className="text-sm text-muted-foreground/60 whitespace-nowrap">
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
