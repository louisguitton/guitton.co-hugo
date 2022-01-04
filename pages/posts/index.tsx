import { GetStaticProps, NextPage } from "next";
import { BreadcrumbJsonLd, NextSeo } from "next-seo";
import type { Blog } from ".contentlayer/types";
import { allBlogs } from ".contentlayer/data";
import Link from "next/link";

export const getStaticProps: GetStaticProps = async () => ({
  props: {
    allBlogs,
    // For SEO
    host: process.env.BASE_URL!,
    url: new URL("/posts", process.env.BASE_URL).href,
  },
});

const ListPostsPage: NextPage<{
  allBlogs: Blog[];
  host: string;
  url: string;
}> = ({ allBlogs, host, url }) => {
  return (
    <>
      <NextSeo
        title="Blog"
        canonical={url}
        openGraph={{
          title: "guitton.co | Blog",
          url: url,
        }}
      />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: "guitton.co",
            item: host,
          },
          {
            position: 2,
            name: "blog",
            item: url,
          },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold">Hello blog posts</h1>
        <ul className="pt-12">
          {allBlogs.map((p) => {
            const slug = p.slug ? p.slug : p.fnSlug;
            return (
              <li key={slug}>
                <Link href={`/posts/${slug}`}>
                  <a className="w-full px-3 py-2 bg-amber-200">{p.title}</a>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default ListPostsPage;
