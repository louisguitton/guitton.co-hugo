import useSWR from "swr";
import FeaturedPost from "../components/FeaturedPost";
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

  return (
    <>
      <h1 className="text-3xl font-bold">Hello world!</h1>
      <section>
        <h2>Featured Posts</h2>
        <ul className="flex flex-col justify-between w-full max-w-sm space-y-2">
          {featuredPosts.map((p) => (
            <li key={p.page}>
              <FeaturedPost post={p} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default Index;
