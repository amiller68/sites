import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Blog as BlogContent } from "@quotientjs/react";
import { formatAuthorString, formatPublishDate } from "@/lib/blog";
import { quotientClient } from "@/services";
import type { Blog } from "@/lib/quotient/types";

// Force static generation
export const dynamic = "force-static";
export const revalidate = 60;

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
  try {
    const result = await quotientClient.blog.list({
      page: 1,
      limit: 100,
      statuses: ["PUBLISHED"],
    });

    return (result.blogs || []).map((blog) => ({
      slug: blog.slug,
    }));
  } catch (error) {
    console.error("Error fetching blogs for static params:", error);
    // Return empty array if API fails - allows build to continue
    return [];
  }
}

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;

  let blog;
  try {
    const result = await quotientClient.blog.get({ slug });

    blog = result.blog;
  } catch (error) {
    console.error(`Error fetching blog metadata for slug: ${slug}`, error);
    return {
      title: "Blog Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const authors = formatAuthorString(
    blog.authors
      .filter((author) => author.name)
      .map((author) => ({
        name: author.name!,
      })),
  );
  const tags = blog.tags.map((tag) => tag.name).join(", ");

  const metadata: Metadata = {
    title: `${blog.title}`,
    description: blog.metaDescription || `Read ${blog.title} on the blog.`,
    openGraph: {
      title: blog.title,
      description: blog.metaDescription || `Read ${blog.title} on the blog.`,
      type: "article",
      url: `${process.env.BASE_URL}/blog/${slug}`,
      images: blog.dominantImageUrl
        ? [
            {
              url: blog.dominantImageUrl,
              width: 1200,
              height: 630,
              alt: blog.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.metaDescription || `Read ${blog.title} on the blog.`,
      images: blog.dominantImageUrl ? [blog.dominantImageUrl] : undefined,
    },
    other: {
      "article:author": authors,
      "article:tag": tags,
    },
  };

  if (blog.publishDate) {
    metadata.other!["article:published_time"] = blog.publishDate;
  }

  return metadata;
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;

  let blog;
  try {
    const result = await quotientClient.blog.get({ slug });
    blog = result.blog;
  } catch (error) {
    console.error(`Error fetching blog for slug: ${slug}`, error);
    return notFound();
  }

  if (!blog) {
    return notFound();
  }

  return (
    <div className="flex justify-center py-12">
      <div className="max-w-3xl w-full">
        <Link
          href="/blog"
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
          back to posts
        </Link>

        <article>
          {/* Header */}
          <header className="mb-10">
            <h1 className="text-2xl font-medium tracking-tight">
              {blog.title}
            </h1>

            {/* Meta */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {blog.authors && blog.authors.length > 0 && (
                <>
                  <span>
                    {formatAuthorString(
                      blog.authors
                        .filter((author) => author.name)
                        .map((author) => ({
                          name: author.name!,
                        })),
                    )}
                  </span>
                  <span>·</span>
                </>
              )}
              {blog.publishDate && (
                <span>{formatPublishDate(blog.publishDate)}</span>
              )}
              {blog.tags && blog.tags.length > 0 && (
                <>
                  <span>·</span>
                  <span>{blog.tags.map((tag) => tag.name).join(", ")}</span>
                </>
              )}
            </div>

            {blog.metaDescription && (
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {blog.metaDescription}
              </p>
            )}
          </header>

          {/* Featured Image */}
          {blog.dominantImageUrl && (
            <div className="mb-12">
              <Image
                src={blog.dominantImageUrl}
                alt={blog.title}
                width={1200}
                height={630}
                className="w-full rounded-lg"
                style={{ objectFit: "cover" }}
              />
            </div>
          )}

          {/* Content */}
          <div className="max-w-none">
            <BlogContent
              content={blog.content}
              elementClassName={{
                strong: "font-medium",
                em: "italic",
                code: "px-1 py-0.5 rounded bg-muted text-sm font-mono",
                a: "underline underline-offset-2 hover:text-foreground transition-colors",
                h1: "text-xl font-medium mb-4 mt-8",
                h2: "text-lg font-medium mb-3 mt-8",
                h3: "text-base font-medium mb-3 mt-6",
                h4: "text-base font-medium mb-2 mt-4",
                h5: "text-sm font-medium mb-2 mt-3",
                h6: "text-sm font-medium mb-2 mt-2",
                p: "mb-4 leading-relaxed text-foreground/90",
                ul: "list-disc pl-5 mb-4 space-y-1",
                ol: "list-decimal pl-5 mb-4 space-y-1",
                li: "leading-relaxed text-foreground/90",
                blockquote:
                  "border-l-2 border-border pl-4 py-1 my-4 text-muted-foreground",
                codeBlock:
                  "bg-muted p-4 rounded mb-4 mt-2 overflow-x-auto font-mono text-sm",
                image: "rounded my-6 w-full",
                asset: "my-4",
              }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}
