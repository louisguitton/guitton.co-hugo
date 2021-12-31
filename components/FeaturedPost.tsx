import Link from "next/link";
import { PageView } from "../lib/types";

const FeaturedPost: React.FC<{ post: PageView }> = ({ post }) => {
  return (
    <Link href={post.page} passHref>
      <div className="flex p-4 m-2 bg-gray-200 rounded-lg">
        <div className="w-64 bg-gray-400 rounded-lg" />
        <div className="flex flex-col items-start ml-4">
          <h4 className="font-semibold ">{post.page ?? "Heading"}</h4>
          <p className="text-sm">{post.views ?? "Page views"}</p>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedPost;
