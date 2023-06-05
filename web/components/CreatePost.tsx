"use client";

import { useState } from "react";

import { CreatePostDocument, Post, PostInput } from "@/gql/graphqlcomponents";
import { Posts } from "@/typescomponents";
import { useFetchPosts } from "@/hooks/useFetchPostscomponents";
import { client } from "@/lib/clientcomponents";
import { useMe } from "@/hooks/useMecomponents";
import CreatePostModal from "./CreatePostModal";
import { getTextSnippet } from "@/utils/getTextSnippetcomponents";

const getOptimisticData = (currentData: Posts[] | undefined, post: Post) => {
  if (currentData) {
    let last = currentData.length - 1;
    currentData[last].posts = currentData[last].posts.slice(0, -1);
    return [{ posts: [post] }, ...currentData];
  } else {
    return [{ posts: [post] }];
  }
};

export default function CreatePost() {
  const [isVisible, setIsVisible] = useState(false);
  const { data } = useMe();
  const { data: posts, mutate } = useFetchPosts();

  const closeModal = () => setIsVisible(false);

  const handleClick = (post: Partial<Post>) => {
    mutate(
      async () => {
        const { createPost } = await client.request(CreatePostDocument, {
          input: post as PostInput,
        });
        if (!createPost.id) throw new Error();
        return getOptimisticData(posts, createPost as Post);
      },
      {
        optimisticData: (currentData: Posts[] | undefined) => {
          let newPost = {
            ...post,
            textSnippet: getTextSnippet(post?.text!),
            text: post?.text!,
            votes: 0,
            user: {
              username: data?.me?.username,
            },
            createdAt: new Date().toISOString(),
            id: Date.now(),
          } as Post;
          return getOptimisticData(currentData, newPost);
        },
        rollbackOnError: true,
      }
    );
    closeModal();
  };

  return (
    <>
      <CreatePostModal
        handleClick={handleClick}
        closeModal={closeModal}
        isVisible={isVisible}
      />
      <div className="text-right">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-primary inline-block rounded-md p-3 mb-3"
        >
          Create Post
        </button>
      </div>
    </>
  );
}
