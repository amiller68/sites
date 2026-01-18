# TypeScript Patterns

This document describes the architecture patterns and conventions used in the krondor/sites TypeScript codebase.

## Overview

The project uses:
- **Next.js 15** with App Router
- **Quotient CMS** for content management
- **Tailwind CSS** for styling
- **Radix UI** for accessible component primitives
- **class-variance-authority** for component variants

---

## Next.js 15 App Router

### Server vs Client Components

**Default to Server Components** - They render on the server, have access to server-only resources, and reduce client bundle size.

```typescript
// app/blog/page.tsx - Server Component (default)
import { QuotientServerClient } from '@/services/quotient-server-client'

export default async function BlogPage() {
  const client = QuotientServerClient()
  const { blogs } = await client.blogs.list({ limit: 10 })

  return (
    <div>
      {blogs.map(blog => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  )
}
```

**Use Client Components when you need:**
- Event handlers (onClick, onChange, etc.)
- React hooks (useState, useEffect, etc.)
- Browser APIs
- Interactive UI

```typescript
// components/contact-form.tsx - Client Component
"use client";

import { useState } from "react";
import { useContactSubmit } from "@/lib/quotient/client";

export function ContactForm() {
  const [email, setEmail] = useState("");
  const contactSubmit = useContactSubmit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await contactSubmit({ emailAddress: email });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
    </form>
  );
}
```

### Layout Pattern

Layouts wrap pages and persist across navigation:

```typescript
// app/layout.tsx
"use client";

import { ClientProviders } from "@/providers/client-providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <nav>{/* Navigation */}</nav>
          <main>{children}</main>
          <footer>{/* Footer */}</footer>
        </ClientProviders>
      </body>
    </html>
  );
}
```

### Dynamic Routes

```typescript
// app/blog/[slug]/page.tsx
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const client = QuotientServerClient();
  const { blog } = await client.blogs.get({ slug });

  return <article>{/* Blog content */}</article>;
}
```

---

## Quotient CMS Integration

### Server-Side Fetching

Use the server client for data fetching in Server Components:

```typescript
// src/services/quotient-server-client.ts
import { QuotientServer } from "@quotientjs/server";

export function QuotientServerClient() {
  return QuotientServer.client({
    projectId: process.env.NEXT_PUBLIC_QUOTIENT_PROJECT_ID!,
    apiKey: process.env.QUOTIENT_API_KEY!,
  });
}
```

```typescript
// Usage in Server Component
const client = QuotientServerClient();
const { blogs } = await client.blogs.list({ limit: 10 });
```

### Client-Side Hooks

Use the React hooks for client-side interactions:

```typescript
// src/lib/quotient/client.ts
"use client";

import { useQuotient } from "@quotientjs/react";
import { useCallback } from "react";

export function useContactSubmit() {
  const { client } = useQuotient();

  const contactSubmit = useCallback(
    async (data: { emailAddress: string }) => {
      if (!client) {
        throw new Error("Quotient client not initialized");
      }
      await client.people.upsert({
        emailAddress: data.emailAddress,
        emailMarketingState: "SUBSCRIBED",
      });
    },
    [client],
  );

  return contactSubmit;
}
```

### Provider Setup

Wrap your app with Quotient provider:

```typescript
// src/providers/client-providers.tsx
"use client";

import { QuotientReact } from "@quotientjs/react";
import { ThemeProvider } from "@repo/ui";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <QuotientReact
        projectId={process.env.NEXT_PUBLIC_QUOTIENT_PROJECT_ID!}
      >
        {children}
      </QuotientReact>
    </ThemeProvider>
  );
}
```

---

## Tailwind CSS

### Utility-First Approach

Use Tailwind's utility classes directly in components:

```typescript
<div className="flex flex-col gap-4 p-6 bg-background rounded-lg border border-border">
  <h2 className="text-xl font-semibold text-foreground">Title</h2>
  <p className="text-muted-foreground">Description</p>
</div>
```

### cn() Utility

Use the `cn()` utility for conditional classes:

```typescript
import { cn } from "@repo/ui";

<button
  className={cn(
    "px-4 py-2 rounded-md transition-colors",
    isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
    className
  )}
>
  Click me
</button>
```

### Design System Colors

Use semantic color tokens:

| Token | Usage |
|-------|-------|
| `bg-background` | Page/card backgrounds |
| `text-foreground` | Primary text |
| `text-muted-foreground` | Secondary text |
| `border-border` | Borders |
| `bg-primary` | Primary actions |
| `text-primary` | Primary accents |

---

## Radix UI Components

### Pattern: Composable Primitives

Use Radix primitives for accessibility:

```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";
import { buttonVariants } from "./variants";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
```

### Variants with class-variance-authority

```typescript
// variants.tsx
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
```

---

## File Organization

### App Directory Structure

```
ts/apps/dev/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   ├── blog/
│   │   ├── page.tsx         # Blog list
│   │   └── [slug]/
│   │       └── page.tsx     # Blog post
│   └── contact/
│       ├── page.tsx         # Contact page
│       └── contact-form.tsx # Client component
├── src/
│   ├── lib/                 # Utilities
│   │   ├── utils.ts
│   │   └── quotient/
│   │       ├── client.ts    # Client-side hooks
│   │       └── types.ts     # Type definitions
│   ├── providers/           # React providers
│   │   └── client-providers.tsx
│   └── services/            # Server-side services
│       └── quotient-server-client.ts
├── tailwind.config.ts
└── next.config.ts
```

### Package Structure

```
ts/packages/ui/
├── src/
│   ├── index.ts             # Main exports
│   ├── lib/
│   │   └── utils.ts         # cn() and utilities
│   ├── components/
│   │   ├── button/
│   │   │   ├── index.tsx
│   │   │   ├── variants.tsx
│   │   │   └── Button.stories.tsx
│   │   └── card/
│   │       └── card.tsx
│   ├── hooks/
│   │   └── use-theme.ts
│   └── providers/
│       └── theme/
│           ├── provider.tsx
│           └── context.ts
├── tailwind.config.ts
└── package.json
```

---

## Type Definitions

### Explicit Types

Define explicit types for API responses:

```typescript
// types.ts
export interface Blog {
  id: string;
  title: string;
  slug: string;
  content?: unknown;
  dominantImageUrl?: string | null;
  publishDate: string | null;
  rawHtml?: string | null;
  authors: {
    id: string;
    name: string | null;
    emailAddress?: string | null;
    avatarUrl?: string | null;
  }[];
  metaDescription: string | null;
  tags: {
    id: string;
    name: string;
    description?: string | null;
  }[];
}

export interface BlogListResponse {
  blogs: Blog[];
  pageData: {
    page: number;
    limit: number;
    total: number;
    isNextPageAvailable: boolean;
  };
}
```

### Component Props

Use explicit prop interfaces:

```typescript
interface BlogCardProps {
  blog: Blog;
  className?: string;
}

export function BlogCard({ blog, className }: BlogCardProps) {
  return (
    <article className={cn("p-4 border rounded-lg", className)}>
      <h2>{blog.title}</h2>
    </article>
  );
}
```

---

## Key Principles

1. **Server Components by default** - Only use client components when needed
2. **Quotient for all content** - No local database
3. **Tailwind for styling** - Use utility classes and semantic tokens
4. **Radix for accessibility** - Build on accessible primitives
5. **Explicit types** - Define interfaces for all data structures
6. **kebab-case files** - Use kebab-case for all file names
