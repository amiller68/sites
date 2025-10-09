export interface Blog {
  id: string;
  title: string;
  slug: string;
  content?: any;
  dominantImageUrl?: string | null;
  publishDate: string | null;
  rawHtml?: string | null;
  authors: {
    id: string;
    name: string;
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

export interface GetBlogResponse {
  blog: Blog;
}
