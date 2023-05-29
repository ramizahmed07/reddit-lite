"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Post } from "@/gql/graphqlcomponents";
import { useMe } from "@/hooks/useMecomponents";

interface Props {
  createPost: (post: Post) => Promise<void>;
}

const initialState: Partial<Post> = {
  title: "",
  text: "",
};

export default function CreatePostModal({ createPost }: Props) {
  const { data } = useMe();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [post, setPost] = useState(initialState);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };

  const closeModal = () => {
    setIsVisible(false);
    setPost(initialState);
    setIsLoading(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await createPost(post as Post);
      closeModal();
    } catch (error: any) {
      closeModal();
      router.push("/login");
    }

    setIsVisible(false);
  };

  if (!data?.me) return null;

  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="mr-4 border w-7 h-7 flex justify-center items-center rounded-full"
      >
        +
      </button>
      {isVisible && (
        <div className="backdrop-blur-sm absolute left-0 top-0 w-full h-full z-10">
          <div className="modal rounded-md p-5 bg-gray-700 absolute left-2/4 top-2/4 m-auto -translate-x-2/4 -translate-y-2/4  w-2/6 h-3/6 z-0">
            <button
              onClick={closeModal}
              className="mb-5 ml-auto outline-none border-none bg-primary w-7 h-7 flex justify-center items-center rounded-full"
            >
              x
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
                {isLoading ? "Posting" : "Post"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
