import { Post as PostType } from "@/gql/graphqlcomponents";
import { timeSince } from "@/utils/timeSincecomponents";

export default function Post({ post }: { post: PostType }) {
  if (!post) return null;
  return (
    <div className="mb-6 bg-primary rounded-sm p-3">
      <p className="text-xsm mb-1">
        <span>Posted by {post.user.username}</span>{" "}
        <span className="pl-[3px]">{timeSince(post?.createdAt)}</span>
      </p>

      <h2 className="mb-2 text-lg font-bold">{post.title}</h2>
      <p className="text-reg">{post.textSnippet}</p>
    </div>
  );
}
