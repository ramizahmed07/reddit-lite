"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

import { Post } from "@/gql/graphqlcomponents";
import { useDetectClickOutside } from "@/hooks/useDetectClickOutsidecomponents";

interface Props {
  isVisible: boolean;
  isEditModal?: boolean;
  closeModal: () => void;
  handleClick: (post: Partial<Post>) => void;
  userPost?: Post;
}

const initialState = {
  title: "",
  text: "",
};

export default function CreatePostModal({
  closeModal,
  isEditModal,
  isVisible,
  handleClick,
  userPost,
}: Props) {
  const { ref } = useDetectClickOutside(isVisible ? close : null);
  const [post, setPost] = useState<Partial<Post>>(
    isEditModal
      ? { title: userPost?.title, text: userPost?.text }
      : initialState
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleClick(post);
    setPost(initialState);
  };

  function close() {
    closeModal();
    setPost(initialState);
  }

  if (!isVisible) return null;

  return (
    <div className="backdrop-blur-sm fixed left-0 top-0 w-full h-full z-10">
      <div
        ref={ref}
        className="modal rounded-md p-5 bg-gray-700 absolute left-2/4 top-2/4 m-auto -translate-x-2/4 -translate-y-2/4  w-2/6 h-3/6 z-0"
      >
        <button
          onClick={close}
          className="mb-5 ml-auto outline-none border-none bg-primary w-7 h-7 flex justify-center items-center rounded-full"
        >
          <AiOutlineClose />
        </button>
        <form className="w-full mb-5" onSubmit={handleSubmit}>
          <div className="field w-full mb-5">
            <label>
              <p className="font-bold pb-2">Title</p>
              <input
                className="w-full p-3 font-light bg-primary  rounded-md outline-none"
                type="title"
                name="title"
                placeholder="title"
                onChange={handleChange}
                value={post.title}
                required={true}
              />
            </label>
          </div>

          <div className="field w-full mb-5">
            <label>
              <p className="font-bold pb-2">Text</p>
              <textarea
                className="w-full p-3 font-light bg-primary  rounded-md outline-none"
                name="text"
                onChange={handleChange}
                value={post.text}
                required={true}
                placeholder="text"
              ></textarea>
            </label>
          </div>

          <button className="self-start bg-primary  py-3 px-6 rounded-md font-bold mb-5">
            {isEditModal ? "Edit Post" : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
