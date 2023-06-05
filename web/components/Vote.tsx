"use client";

import { TbArrowBigDown, TbArrowBigUp } from "react-icons/tb";

import {
  DownvotePostDocument,
  Post,
  UpvotePostDocument,
} from "@/gql/graphqlcomponents";
import { client } from "@/lib/clientcomponents";
import { useFetchPosts } from "@/hooks/useFetchPostscomponents";
import { UPVOTE_COLOR, DOWNVOTE_COLOR } from "@/contantscomponents";
import { useFetchPost } from "@/hooks/useFetchPostcomponents";

interface Posts {
  posts: Post[];
}

const getVoteOptimisticData = (
  postId: number,
  votes: number,
  voteStatus: string,
  type: "upvote" | "downvote",
  currentData: Posts[] | undefined
) => {
  let newStatus: "upvoted" | "downvoted" | "" = "";
  let votesCount = votes;
  if (voteStatus !== "") {
    if (voteStatus === "downvoted")
      newStatus = type === "downvote" ? "" : "upvoted";
    else newStatus = type === "upvote" ? "" : "downvoted";
  } else {
    newStatus = type === "upvote" ? "upvoted" : "downvoted";
  }

  if (voteStatus !== "") {
    if (voteStatus === "downvoted") {
      votesCount = newStatus === "upvoted" ? votesCount + 2 : votesCount + 1;
    } else {
      votesCount = newStatus === "downvoted" ? votesCount - 2 : votesCount - 1;
    }
  } else {
    votesCount = newStatus === "upvoted" ? votesCount + 1 : votesCount - 1;
  }

  if (!currentData) return [];
  return currentData?.map((item) => ({
    ...item,
    posts: item?.posts?.map((post) =>
      post?.id === postId
        ? { ...post, voteStatus: newStatus, votes: votesCount }
        : post
    ),
  }));
};

export default function Vote({
  votes,
  postId,
  voteStatus,
}: {
  votes: number;
  postId: number;
  voteStatus: string;
}) {
  const { data: posts, mutate } = useFetchPosts();
  const { mutate: mutatePost } = useFetchPost(postId);

  const upvote = async () => {
    const { upvote } = await client.request(UpvotePostDocument, {
      upvoteId: postId,
    });
    if (!upvote) return;

    mutate(
      getVoteOptimisticData(postId, votes, voteStatus, "upvote", posts),
      false
    );
    mutatePost();
  };

  const downvote = async () => {
    const { downvote } = await client.request(DownvotePostDocument, {
      downvoteId: postId,
    });
    if (!downvote) return;
    mutate(
      getVoteOptimisticData(postId, votes, voteStatus, "downvote", posts),
      false
    );
    mutatePost();
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={upvote}
        className={`hover:bg-border hover:text-secondary p-[2px] rounded-sm`}
      >
        <TbArrowBigUp
          fill={voteStatus === "upvoted" ? UPVOTE_COLOR : ""}
          color={voteStatus === "upvoted" ? UPVOTE_COLOR : ""}
          size={24}
        />
      </button>
      <div
        className={`text-sm my-1 font-bold ${
          voteStatus === "downvoted" && "text-blue"
        } ${voteStatus === "upvoted" && "text-secondary"}`}
      >
        {votes}
      </div>

      <button
        onClick={downvote}
        className={`hover:bg-border hover:text-blue p-[2px] rounded-sm`}
      >
        <TbArrowBigDown
          fill={voteStatus === "downvoted" ? DOWNVOTE_COLOR : ""}
          color={voteStatus === "downvoted" ? DOWNVOTE_COLOR : ""}
          size={24}
        />
      </button>
    </div>
  );
}
