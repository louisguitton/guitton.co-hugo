import clsx from "clsx";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { Post } from "../lib/types";
import { EyeIcon } from "@heroicons/react/outline";

interface Dictionary<T> {
  [Key: string]: T;
}

const colors: Dictionary<string> = {
  Data: "bg-purple-500",
  Gaming: "bg-pink-500",
  Lifestyle: "bg-green-500",
  Cars: "bg-red-500",
};

const FeaturedPost: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <Link href={`/posts/${post.slug}`} passHref>
      <a
        className={clsx(
          "relative flex flex-col items-start justify-end",
          "px-5 pb-5",
          // width & height
          "h-96 col-span-12 md:col-span-6 lg:col-span-4",
          "overflow-hidden bg-gray-800 cursor-pointer group"
        )}>
        <Image
          src={post.image}
          layout="fill"
          alt={post.title}
          className="absolute inset-0 object-cover object-center transition duration-300 ease-out transform scale-100 group-hover:scale-105"
        />
        <span className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent to-gray-900 opacity-90"></span>
        {post.categories ? (
          <span
            className={clsx(
              "px-2 py-0.5",
              colors[post.categories[0]],
              "inline relative mb-3",
              "text-white text-xs uppercase"
            )}>
            {post.categories[0]}
          </span>
        ) : (
          <></>
        )}
        <span className="relative mb-3 text-xl font-bold leading-tight text-white">
          {post.title}
        </span>
        <span className="relative flex text-xs text-white opacity-90">
          <span className="mr-2">
            {moment(post.date).format("MMMM Do, YYYY")}
          </span>
          ·
          <span className="ml-2 font-semibold align-middle has-tooltip">
            {post.views} <EyeIcon className="inline-block w-4 h-4 ml-1" />
            <span className="mt-4 -ml-16 text-xs tooltip w-28">(since 1 year)</span>
          </span>
        </span>
      </a>
    </Link>
  );
};

const FeaturedPosts: React.FC<{ posts: Post[] }> = ({ posts }) => {
  return (
    <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28">
      <div className="flex justify-between w-full pb-5">
        <h2
          className={clsx(
            "px-3 py-2 bg-gray-800",
            "text-sm font-medium text-white uppercase"
          )}>
          Most Read
        </h2>
      </div>
      <div className="grid grid-cols-12 gap-1">
        {posts.map((post) => (
          <FeaturedPost key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedPosts;
