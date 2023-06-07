import { Post as PostType } from "@/gql/graphqlcomponents";
import { timeSince } from "@/utils/timeSincecomponents";
import Link from "next/link";
import PostActions from "./PostActions";
import Vote from "./Vote";

export default function Post({ post }: { post: PostType }) {
  if (!post) return null;
  return (
    <div className="flex mb-6 bg-primary rounded-sm pl-3 pt-3">
      <Vote
        votes={post?.votes}
        postId={post?.id}
        voteStatus={post?.voteStatus}
      />
      <div className="ml-3 w-full">
        <div className="pr-3">
          <p className="text-xsm mb-1 text-light-white">
            <span>Posted by {post.user.username}</span>{" "}
            <span className="pl-[3px]">{timeSince(post?.createdAt)}</span>
          </p>
          <Link href={`/post/${post?.id}`}>
            <h2 className="mb-2 text-lg font-bold">{post.title}</h2>
          </Link>

          <p className="text-reg">{post.textSnippet}</p>
        </div>
        <PostActions post={post} />
      </div>
    </div>
  );
}
