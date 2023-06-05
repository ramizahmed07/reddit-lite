"use client";

import PostActions from "@/components/PostActionscomponents";
import Vote from "@/components/Votecomponents";
import { useFetchPost } from "@/hooks/useFetchPostcomponents";
import { timeSince } from "@/utils/timeSincecomponents";

interface Props {
  params: { id: string };
}

export default function PostPage({ params: { id } }: Props) {
  const { data, error, isLoading, mutate } = useFetchPost(+id);

  if (!data && !isLoading) return null;
  const { post } = data! || {};
  return (
    <div className="w-full h-screen bg-primary">
      <div className="bg-black w-2/3 h-full m-auto p-24 pb-0">
        <div className="bg-primary h-full rounded-md">
          {isLoading && "Loading..."}
          {error && "Something went wrong"}

          {post && (
            <div className="p-3 flex ">
              <Vote
                votes={post?.votes}
                postId={post?.id}
                voteStatus={post?.voteStatus}
              />
              <div className="ml-3 w-full">
                <div className="pr-3">
                  <p className="text-xsm mb-1 text-light-white">
                    <span>Posted by {post?.user.username}</span>{" "}
                    <span className="pl-[3px]">
                      {timeSince(post?.createdAt)}
                    </span>
                  </p>

                  <h2 className="mb-2 text-lg font-bold">{post?.title}</h2>
                  <p className="text-reg">{post?.text}</p>
                </div>
                <PostActions post={post} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
