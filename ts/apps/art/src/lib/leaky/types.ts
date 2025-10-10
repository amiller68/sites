export interface BlogPost {
  name: string;
  title: string;
  description: string;
  created_at: string;
  content?: string;
  category: string;
  tags: string[];
}

export interface GalleryImage {
  name: string;
  created_at: string;
  cid: string;
}

export interface AudioTrack {
  name: string;
  created_at: string;
}

export interface LeakyFileObject {
  path: string;
  is_dir: boolean;
  cid: string;
  object?: {
    created_at: any; // Can be array [year, day_of_year, ...] or string
    properties?: Record<string, any>;
  };
}
