import useSWR from "swr";
import FeaturedPost from "../components/FeaturedPost";
import Hero from "../components/Hero";
import fetcher from "../lib/fetcher";
import { FeaturedPosts } from "../lib/types";

function Index() {
  const { data: featuredPosts } = useSWR<FeaturedPosts>(
    "/api/ga/featured-posts?startDate=365daysAgo",
    fetcher
  );

  if (!featuredPosts) {
    return null;
  }

  return <Hero />;
}

export default Index;
