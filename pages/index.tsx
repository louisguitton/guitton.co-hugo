// Ref: https://swr.vercel.app/docs/with-nextjs
import FeaturedPosts from "../components/FeaturedPosts";
import Hero from "../components/Hero";
import { FeaturedPostsData, Post } from "../lib/types";
import useSWR, { SWRConfig } from "swr";
import fetcher from "../lib/fetcher";
import { allBlogs } from ".contentlayer/data";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { getGoogleAnalyticsFeaturedPosts } from "../lib/google";
import { cacheConfig } from "../lib/constants";

export const getStaticProps: GetStaticProps = async () => {
  const results = await getGoogleAnalyticsFeaturedPosts("365daysAgo");
  return {
    props: {
      fallback: {
        "/api/ga/featured-posts?startDate=365daysAgo": results,
      },
    },
    // revalidate is in seconds, Ref: https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation
    revalidate: cacheConfig.backend,
  };
};

function FeaturedSection() {
  const { data: featuredPosts } = useSWR<FeaturedPostsData>(
    "/api/ga/featured-posts?startDate=365daysAgo"
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
  return <FeaturedPosts posts={posts.concat(hardcodedPosts)} />;
}

function Index({ fallback }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Hero />
      {/* References:
        - https://swr.vercel.app/docs/global-configuration
        - https://swr.vercel.app/docs/options#options
      */}
      <SWRConfig
        value={{
          fallback,
          fetcher,
          // refreshInterval is in ms
          refreshInterval: cacheConfig.frontend * 1000,
        }}>
        <FeaturedSection />
      </SWRConfig>
    </>
  );
}

export default Index;
