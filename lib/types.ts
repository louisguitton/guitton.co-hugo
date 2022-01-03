export type PageView = {
  page: string;
  views: number;
  since: string;
};
export type FeaturedPosts = PageView[];

// see contentlayer.config.ts
export type Post = {
  title: string
  slug: string
  date: string
  categories?: string[]
  series?: string[]
  image: string
  views: number
}
