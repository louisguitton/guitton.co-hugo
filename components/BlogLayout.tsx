import type { Blog } from ".contentlayer/types";
import moment from "moment";

// Ref: https://tailwindcss.com/docs/typography-plugin
const BlogLayout: React.FC<{ post: Blog }> = ({ post, children }) => {
  return (
    <article className="relative px-4 sm:px-6 lg:px-8">
      <div className="mx-auto text-lg max-w-prose">
        <h1 className="block mt-2 text-3xl font-extrabold leading-8 tracking-tight text-center text-gray-900 sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-8 text-xl leading-8 text-gray-500">
          <span className="mr-1 font-semibold">
            {post.categories?.join(" - ")}
          </span>
          ·
          <span className="ml-1">
            {moment(post.date).format("MMMM DD, YYYY")}
          </span>
        </p>
      </div>
      <div className="mx-auto mt-6 prose text-gray-500 prose-indigo">
        {children}
      </div>
    </article>
  );
};

export default BlogLayout;
