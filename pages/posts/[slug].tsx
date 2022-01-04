import { useMDXComponent } from "next-contentlayer/hooks";

import { allBlogs } from ".contentlayer/data";
import type { Blog } from ".contentlayer/types";
import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import BlogLayout from "../../components/BlogLayout";
import { NextSeo } from "next-seo";

const componentsUsedInPosts = {};

export const getStaticPaths: GetStaticPaths = () => ({
  paths: allBlogs.map((p) => ({
    params: { slug: p.slug ? p.slug : p.fnSlug },
  })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = ({ params }) => {
  const post = allBlogs.find((post) => post.slug === params?.slug)!;
  return {
    props: {
      // for content
      post,
      // For SEO
      url: new URL(`/posts/${post.slug}`, process.env.BASE_URL).href,
    },
  };
};

const PostPage: NextPage<{ post: Blog; url: string }> = ({ post, url }) => {
  const Component = useMDXComponent(post.body.code);

  return (
    <>
      <NextSeo
        title={post.title}
        description={post.summary}
        canonical={url}
        noindex={post.draft ? post.draft : false}
        openGraph={{
          title: post.title,
          description: post.summary,
          url: url,
          type: "article",
          article: {
            publishedTime: post.date,
            modifiedTime: post.lastmod,
            expirationTime: undefined,
            section: post.categories ? post.categories[0] : undefined,
            authors: ["https://guitton.co/about"],
            tags: post.categories,
          },
          images: [
            {
              url: post.image,
              alt: post.title,
              // TODO: add width & height otherwise it falls back to next-seo.config.ts
            },
          ],
        }}
      />

      <BlogLayout post={post}>
        <Component components={componentsUsedInPosts} />
      </BlogLayout>
    </>
  );
};

export default PostPage;
