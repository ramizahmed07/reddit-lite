import { Post } from "@/gql/graphqlcomponents";
import PostMenu from "./PostMenu";

export default function PostActions({ post }: { post: Post }) {
  return (
    <div className="mt-3 w-full h-fit flex items-center">
      <PostMenu post={post} />
    </div>
  );
}
