"use client";

import { useState } from "react";
import { TbDots } from "react-icons/tb";
import { BiHide } from "react-icons/bi";

import { Post } from "@/gql/graphqlcomponents";
import { useDetectClickOutside } from "@/hooks/useDetectClickOutsidecomponents";
import DeletePost from "./DeletePost";
import UpdatePost from "./UpdatePost";

export default function PostMenu({ post }: { post: Post }) {
  const [isVisible, setIsVisible] = useState(false);
  const { ref } = useDetectClickOutside(() => setIsVisible(false));

  const closeMenu = () => setIsVisible(false);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsVisible(!isVisible);
        }}
        className="hover:bg-border p-1 text-light-white rounded-sm"
      >
        <TbDots size={20} />
      </button>
      {isVisible && (
        <div
          className="[&>button]:flex [&>button]:items-center [&>button]:text-light-white [&>button]:text-left [&>button]:border-solid [&>button]:border-0 [&>button]:border-t [&>button]:border-border 
        flex flex-col justify-start absolute left-0 top-7 shadow-[0_2px_4px_0_rgba(215,218,220,0.5)]
         rounded-[4px] z-10 bg-primary w-56 h-fit bg-orange"
        >
          {post?.isMine && (
            <>
              <UpdatePost post={post} closeMenu={closeMenu} />
              <DeletePost postId={post?.id} closeMenu={closeMenu} />
            </>
          )}

          <button className="p-2 [&>svg]:mr-[6px] hover:bg-light-blue hover:text-white">
            <BiHide size={20} /> Hide
          </button>
        </div>
      )}
    </div>
  );
}
