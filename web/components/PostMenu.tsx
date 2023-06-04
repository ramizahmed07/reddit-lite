"use client";

import { useState } from "react";
import { TbDots } from "react-icons/tb";
import { AiOutlineDelete } from "react-icons/ai";
import { HiOutlinePencil } from "react-icons/hi";
import { BiHide } from "react-icons/bi";

import { DeletePostDocument, Post } from "@/gql/graphqlcomponents";
import { client } from "@/lib/clientcomponents";
import { Posts } from "@/typescomponents";
import useDetectClickOutside from "@/hooks/useDetectClickOutsidecomponents";
import useFetchPosts from "@/hooks/useFetchPostscomponents";

const getOptimisticData = (currentData: Posts[] | undefined, id: number) =>
  currentData?.map((item) => ({
    ...item,
    posts: item.posts.filter((post) => post?.id !== id),
  })) || [];

export default function PostMenu({ post }: { post: Post }) {
  const { id } = post;
  const [isVisible, setIsVisible] = useState(false);
  const { ref } = useDetectClickOutside(() => setIsVisible(false));
  const { data: posts, mutate } = useFetchPosts();

  const toggle = () => setIsVisible(!isVisible);

  const deletePost = () => {
    toggle();
    mutate(
      async () => {
        const { deletePost } = await client.request(DeletePostDocument, {
          id,
        });
        if (!deletePost) throw new Error();
        return getOptimisticData(posts, id);
      },
      {
        optimisticData(currentData?) {
          return getOptimisticData(currentData, id);
        },
        revalidate: false,
      }
    );
  };

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className="hover:bg-border p-1 text-light-white rounded-sm"
      >
        <TbDots size={20} />
      </button>
      {isVisible && (
        <div
          ref={ref}
          className="[&>button]:flex [&>button]:items-center [&>button]:text-light-white [&>button]:text-left [&>button]:border-solid [&>button]:border-0 [&>button]:border-t [&>button]:border-border 
        flex flex-col justify-start absolute left-0 top-7 shadow-[0_2px_4px_0_rgba(215,218,220,0.5)]
         rounded-[4px] z-10 bg-primary w-56 h-fit bg-orange"
        >
          <button className="p-2 [&>svg]:mr-[6px] hover:bg-light-blue hover:text-white">
            <HiOutlinePencil size={20} /> Edit Post
          </button>
          {post?.isMine && (
            <button
              onClick={deletePost}
              className="p-2 [&>svg]:mr-[6px] hover:bg-light-blue hover:text-white"
            >
              <AiOutlineDelete size={20} /> Delete
            </button>
          )}

          <button className="p-2 [&>svg]:mr-[6px] hover:bg-light-blue hover:text-white">
            <BiHide size={20} /> Hide
          </button>
        </div>
      )}
    </div>
  );
}
