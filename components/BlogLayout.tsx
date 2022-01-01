import type { Blog } from ".contentlayer/types";

const BlogLayout: React.FC<{ post: Blog }> = ({ post, children }) => {
  return (
    <article>
      <h1>{post.title}</h1>
      {children}
    </article>
  );
};

export default BlogLayout;
