import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Blog as BlogContent } from "@quotientjs/react";
import { formatAuthorString, formatPublishDate } from "@/lib/blog";
import { quotientClient } from "@/services";
import type { Blog } from "@/lib/quotient/types";

// Enable ISR with 60 second revalidation
export const revalidate = 60;

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
  try {
    const result = await quotientClient.blog.list({
      page: 1,
      limit: 100,
      statuses: ["ACTIVE"],
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
    blog.authors.map((author) => ({
      name: author.name,
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

  const category = blog.tags[0]?.name;

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
          <header className="mb-12">
            {category && (
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  {category}
                </span>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {blog.title}
            </h1>

            {blog.metaDescription && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {blog.metaDescription}
              </p>
            )}

            {/* Meta */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {blog.authors && blog.authors.length > 0 && (
                <>
                  <span>
                    {formatAuthorString(
                      blog.authors.map((author) => ({
                        name: author.name,
                      })),
                    )}
                  </span>
                  <span>•</span>
                </>
              )}
              {blog.publishDate && (
                <span>{formatPublishDate(blog.publishDate)}</span>
              )}
            </div>
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
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <BlogContent
              content={blog.content}
              elementClassName={{
                strong: "font-bold",
                em: "italic",
                code: "px-1.5 py-0.5 rounded bg-muted text-sm font-mono",
                a: "text-primary hover:text-primary/80 underline underline-offset-2 transition-colors",
                h1: "text-3xl font-bold mb-4 mt-8 leading-tight",
                h2: "text-2xl font-semibold mb-3 mt-8 leading-tight",
                h3: "text-xl font-medium mb-3 mt-6 leading-tight",
                h4: "text-lg font-medium mb-2 mt-4 leading-tight",
                h5: "text-base font-medium mb-2 mt-3 leading-tight",
                h6: "text-sm font-medium mb-2 mt-2 leading-tight",
                p: "mb-4 leading-relaxed text-foreground",
                ul: "list-disc pl-6 mb-6 space-y-2",
                ol: "list-decimal pl-6 mb-6 space-y-2",
                li: "leading-relaxed",
                blockquote:
                  "border-l-4 border-border pl-4 py-2 my-6 italic text-muted-foreground",
                codeBlock:
                  "bg-muted p-4 rounded-lg mb-6 mt-4 overflow-x-auto font-mono text-sm border border-border",
                image: "rounded-lg my-8 w-full",
                asset: "my-6",
              }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}
