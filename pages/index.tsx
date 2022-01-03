import FeaturedPosts from "../components/FeaturedPosts";
import Hero from "../components/Hero";
import { FeaturedPosts as FeaturedPostsData, Post } from "../lib/types";
import useSWR from "swr";
import fetcher from "../lib/fetcher";
import { allBlogs } from ".contentlayer/data";
import type { Blog } from ".contentlayer/types";

function Index() {
  const { data: featuredPosts } = useSWR<FeaturedPostsData>(
    "/api/ga/featured-posts?startDate=365daysAgo",
    fetcher
  );
  if (!featuredPosts) {
    return <div>Loading ...</div>;
  }

  const posts: Post[] = [];
  featuredPosts.forEach((featuredPost) => {
    const p = allBlogs.find(
      (post) => `/posts/${post.slug}/` == featuredPost.page
    );
    if (p)
      posts.push({
        title: p.title,
        slug: p.slug ? p.slug : p.fnSlug,
        date: p.date,
        categories: p.categories,
        series: p.series,
        image: p.image,
        views: featuredPost.views,
      });
  });

  const hardcodedPosts: Post[] = [
    {
      title: "The Gaming Revolution has Taken Over",
      slug: "#",
      categories: ["Gaming"],
      date: "2020-03-16",
      image: "https://cdn.devdojo.com/images/may2021/blog-img-1.jpg",
      views: 3,
    },
    {
      title: "Learn How to Create Beautiful Photos",
      slug: "#",
      categories: ["Lifestyle"],
      date: "2020-03-10",
      image: "https://cdn.devdojo.com/images/may2021/blog-img-2.jpg",
      views: 5,
    },
    {
      title: "The Ultimate List of the Fastest Vehicles",
      slug: "#",
      categories: ["Cars"],
      date: "2020-02-20",
      image: "https://cdn.devdojo.com/images/may2021/blog-img-3.jpg",
      views: 7,
    },
  ];

  return (
    <>
      <Hero />
      <FeaturedPosts posts={posts.concat(hardcodedPosts)} />
    </>
  );
}

export default Index;
