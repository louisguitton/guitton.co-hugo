export type PostView = {
  page: string;
  views: number;
  since: string;
};
export type FeaturedPostsData = PostView[];

export type SitePageViewsData = {
  pageViews: number;
  since: string;
};

// see contentlayer.config.ts
export type Post = {
  title: string;
  slug: string;
  date: string;
  categories?: string[];
  series?: string[];
  image: string;
  views: number;
};
