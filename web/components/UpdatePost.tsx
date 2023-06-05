"use client";

import { useState } from "react";
import { HiOutlinePencil } from "react-icons/hi";

import {
  Post,
  UpdatePostDocument,
  UpdatePostInput,
} from "@/gql/graphqlcomponents";
import { useMe } from "@/hooks/useMecomponents";
import { useFetchPosts } from "@/hooks/useFetchPostscomponents";
import CreatePostModal from "./CreatePostModal";
import { client } from "@/lib/clientcomponents";
import { Posts } from "@/typescomponents";
import { getTextSnippet } from "@/utils/getTextSnippetcomponents";

interface Props {
  closeMenu: () => void;
  post: Post;
}

const getOptimisticData = (currentData: Posts[] | undefined, post: Post) => {
  return (
    currentData?.map((item) => ({
      ...item,
      posts: item?.posts?.map((userPost) =>
        userPost?.id === post?.id ? { ...userPost, ...post } : userPost
      ),
    })) || []
  );
};

export default function UpdatePost({ closeMenu, post }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const { data } = useMe();
  const { data: posts, mutate } = useFetchPosts();

  const closeModal = () => {
    setIsVisible(false);
    closeMenu();
  };

  const handleClick = (selectedPost: Partial<Post>) => {
    mutate(
      async () => {
        const { updatePost } = await client.request(UpdatePostDocument, {
          input: selectedPost as UpdatePostInput,
          updatePostId: post?.id!,
        });
        if (!updatePost.id) throw new Error();
        return getOptimisticData(posts, updatePost as Post);
      },
      {
        optimisticData: (currentData: Posts[] | undefined) => {
          let updatedPost = {
            id: post?.id,
            text: selectedPost?.text,
            textSnippet: getTextSnippet(selectedPost?.text!),
            title: selectedPost?.title,
          } as Post;
          return getOptimisticData(currentData, updatedPost);
        },
        rollbackOnError: true,
      }
    );
    closeModal();
  };

  return (
    <>
      <CreatePostModal
        isEditModal={true}
        closeModal={closeModal}
        handleClick={handleClick}
        isVisible={isVisible}
        userPost={post}
      />

      <button
        onClick={() => setIsVisible(true)}
        className="p-2 [&>svg]:mr-[6px] hover:bg-light-blue hover:text-white"
      >
        <HiOutlinePencil size={20} /> Edit Post
      </button>
    </>
  );
}
