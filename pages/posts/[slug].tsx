import { useMDXComponent } from "next-contentlayer/hooks";

import { allBlogs } from ".contentlayer/data";
import type { Blog } from ".contentlayer/types";
import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import BlogLayout from "../../components/BlogLayout";
import { BlogJsonLd, BreadcrumbJsonLd, NextSeo } from "next-seo";

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
      host: process.env.BASE_URL!,
      url: new URL(`/posts/${post.slug}`, process.env.BASE_URL).href,
    },
  };
};

const PostPage: NextPage<{ post: Blog; host: string; url: string }> = ({
  post,
  host,
  url,
}) => {
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
      <BlogJsonLd
        url={url}
        title={post.title}
        images={[post.image]}
        datePublished={post.date}
        dateModified={post.lastmod}
        authorName="Louis Guitton"
        description={post.summary}
      />
      <BreadcrumbJsonLd
        // TODO: add support to next-seo for multiple breadcrumb trails
        // currently it overrides with the last one
        itemListElements={[
          {
            position: 1,
            name: "guitton.co",
            item: host,
          },
          {
            position: 2,
            name: "blog",
            item: new URL(`/posts/`, host).href,
          },
          {
            position: 3,
            name: post.title,
            item: url,
          },
        ]}
      />

      <BlogLayout post={post}>
        <Component components={componentsUsedInPosts} />
      </BlogLayout>
    </>
  );
};

export default PostPage;
