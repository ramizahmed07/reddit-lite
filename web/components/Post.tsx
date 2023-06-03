import { Post as PostType } from "@/gql/graphqlcomponents";
import { timeSince } from "@/utils/timeSincecomponents";
import Vote from "./Vote";

export default function Post({ post }: { post: PostType }) {
  if (!post) return null;
  return (
    <div className="flex  mb-6 bg-primary rounded-sm p-3">
      <Vote
        votes={post?.votes}
        postId={post?.id}
        voteStatus={post?.voteStatus}
      />
      <div className="ml-3">
        <p className="text-xsm mb-1">
          <span>Posted by {post.user.username}</span>{" "}
          <span className="pl-[3px]">{timeSince(post?.createdAt)}</span>
        </p>

        <h2 className="mb-2 text-lg font-bold">{post.title}</h2>
        <p className="text-reg">{post.text}</p>
      </div>
    </div>
  );
}
