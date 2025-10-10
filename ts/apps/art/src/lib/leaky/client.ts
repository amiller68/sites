import type {
  BlogPost,
  GalleryImage,
  AudioTrack,
  LeakyFileObject,
} from "./types";

// Hard-coded leaky API URL
const LEAKY_API_URL = "https://leaky.krondor.org";

function parseDate(dateArray: any): string {
  // Handle array format: [year, day_of_year, hour, minute, second, nanosecond, ...]
  if (Array.isArray(dateArray) && dateArray.length >= 2) {
    const [year, dayOfYear] = dateArray;

    // Validate inputs
    if (
      typeof year !== "number" ||
      typeof dayOfYear !== "number" ||
      year < 1970 ||
      dayOfYear < 1 ||
      dayOfYear > 366
    ) {
      console.error("Invalid date array values:", dateArray);
      return new Date().toISOString();
    }

    // Create date from ordinal date (year + day of year)
    // Start with Jan 1st of the year, then add (dayOfYear - 1) days
    const date = new Date(Date.UTC(year, 0, 1));
    date.setUTCDate(dayOfYear);

    return date.toISOString();
  }
  // Fallback to string if it's already in ISO format
  if (typeof dateArray === "string") {
    return dateArray;
  }
  // If we can't parse it, return current date as fallback
  console.error("Unable to parse date:", dateArray);
  return new Date().toISOString();
}

export const leakyClient = {
  blog: {
    async list(category?: string): Promise<BlogPost[]> {
      const url = `${LEAKY_API_URL}/blog?deep=true`;
      const response = await fetch(url, {
        next: { revalidate: 60 },
      });

      if (!response.ok) {
        return [];
      }

      const items: LeakyFileObject[] = await response.json();
      const posts: BlogPost[] = [];

      for (const item of items) {
        try {
          if (item.is_dir || !item.object) continue;

          const path = item.path;
          const pathParts = path.replace(/^\//, "").split("/");

          // Handle both flat paths (just filename) and category/filename paths
          let itemCategory = "thoughts"; // default category
          let filename = path;

          if (pathParts.length === 2) {
            // Path has category: category/filename
            [itemCategory, filename] = pathParts;
          } else if (pathParts.length === 1) {
            // Flat path: just filename
            filename = pathParts[0];
          } else {
            // Skip paths with more than 2 parts
            continue;
          }

          // Filter by category if specified
          if (category && itemCategory !== category) continue;

          const data = item.object;
          if (!data.properties || !data.created_at) continue;

          posts.push({
            name: filename,
            title: data.properties.title,
            description: data.properties.description,
            created_at: parseDate(data.created_at),
            category: itemCategory,
            tags: data.properties.tags || [],
          });
        } catch (error) {
          console.error("Error parsing blog post:", error);
          continue;
        }
      }

      return posts.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    },

    async get(category: string, name: string): Promise<BlogPost | null> {
      try {
        // Try with category first
        let metaResponse = await fetch(`${LEAKY_API_URL}/blog/${category}`, {
          next: { revalidate: 60 },
        });

        // If category endpoint fails, try getting from root
        if (!metaResponse.ok) {
          metaResponse = await fetch(`${LEAKY_API_URL}/blog?deep=true`, {
            next: { revalidate: 60 },
          });
        }

        if (!metaResponse.ok) return null;

        const items: LeakyFileObject[] = await metaResponse.json();
        const postItem = items.find(
          (item) =>
            !item.is_dir &&
            (item.path === name || item.path.endsWith(`/${name}`)),
        );

        if (!postItem || !postItem.object) return null;

        const data = postItem.object;
        if (!data.properties || !data.created_at) return null;

        // Try to get content with category first, then without
        let contentResponse = await fetch(
          `${LEAKY_API_URL}/blog/${category}/${name}?html=true`,
          {
            next: { revalidate: 60 },
          },
        );

        // If that fails, try without category
        if (!contentResponse.ok) {
          contentResponse = await fetch(
            `${LEAKY_API_URL}/blog/${name}?html=true`,
            {
              next: { revalidate: 60 },
            },
          );
        }

        if (!contentResponse.ok) return null;

        const content = await contentResponse.text();

        return {
          name,
          title: data.properties.title,
          description: data.properties.description,
          created_at: parseDate(data.created_at),
          content,
          category,
          tags: data.properties.tags || [],
        };
      } catch (error) {
        console.error("Error fetching blog post:", error);
        return null;
      }
    },
  },

  gallery: {
    async list(): Promise<GalleryImage[]> {
      try {
        const response = await fetch(`${LEAKY_API_URL}/gallery?deep=true`, {
          next: { revalidate: 60 },
        });

        if (!response.ok) return [];

        const items: LeakyFileObject[] = await response.json();
        const images: GalleryImage[] = [];

        for (const item of items) {
          try {
            if (item.is_dir || !item.object) continue;

            const data = item.object;
            if (!data.created_at) continue;

            const cleanName = item.path.replace(/^\//, "");

            images.push({
              name: cleanName,
              created_at: parseDate(data.created_at),
              cid: item.cid,
            });
          } catch (error) {
            console.error("Error parsing gallery image:", error);
            continue;
          }
        }

        return images.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        return [];
      }
    },

    getUrl(name: string, thumbnail: boolean = false): string {
      const suffix = thumbnail ? "?thumbnail=true" : "";
      return `${LEAKY_API_URL}/gallery/${name}${suffix}`;
    },
  },

  music: {
    async list(): Promise<AudioTrack[]> {
      try {
        const response = await fetch(`${LEAKY_API_URL}/music/me`, {
          next: { revalidate: 60 },
        });

        if (!response.ok) return [];

        const items: LeakyFileObject[] = await response.json();
        const tracks: AudioTrack[] = [];

        for (const item of items) {
          try {
            if (item.is_dir || !item.object) continue;

            const data = item.object;
            if (!data.created_at) continue;

            tracks.push({
              name: item.path,
              created_at: parseDate(data.created_at),
            });
          } catch (error) {
            console.error("Error parsing audio track:", error);
            continue;
          }
        }

        return tracks.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      } catch (error) {
        console.error("Error fetching audio tracks:", error);
        return [];
      }
    },

    getUrl(name: string): string {
      return `${LEAKY_API_URL}/music/me/${name}`;
    },
  },
};
