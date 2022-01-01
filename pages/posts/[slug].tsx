import { useMDXComponent } from "next-contentlayer/hooks";

import { allBlogs } from ".contentlayer/data";
import { Button } from "../../components/Button";
import type { Blog } from ".contentlayer/types";
import { GetStaticProps, GetStaticPaths } from "next";
import BlogLayout from "../../components/BlogLayout";

const PostPage: React.FC<{ post: Blog }> = ({ post }) => {
  const Component = useMDXComponent(post.body.code);

  return (
    <BlogLayout post={post}>
      <Component components={{ Button }} />
    </BlogLayout>
  );
};

export default PostPage;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: allBlogs.map((p) => ({
    params: { slug: p.slug ? p.slug : p.fnSlug },
  })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = ({ params }) => {
  const post = allBlogs.find((post) => post.slug === params?.slug);
  return { props: { post } };
};
