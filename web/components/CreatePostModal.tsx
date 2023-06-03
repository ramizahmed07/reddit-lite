"use client";

import { ChangeEvent, FormEvent, useState } from "react";

import { CreatePostDocument, Post, PostInput } from "@/gql/graphqlcomponents";
import { useMe } from "@/hooks/useMecomponents";
import { client } from "@/lib/clientcomponents";
import useFetchPosts from "@/hooks/useFetchPostscomponents";

interface Posts {
  posts: Post[];
}

const initialState = {
  title: "",
  text: "",
};

export default function CreatePostModal() {
  const { data } = useMe();
  const { data: posts, mutate } = useFetchPosts();
  const [post, setPost] = useState<Partial<Post>>(initialState);

  const [isVisible, setIsVisible] = useState(false);

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
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(createPost(), {
      optimisticData: (currentData: Posts[] | undefined) => {
        let newPost = {
          ...post,
          textSnippet: post?.text!,
          user: {
            username: data?.me?.username,
          },
          createdAt: new Date().toISOString(),
          id: Date.now(),
        } as Post;

        if (currentData) {
          let last = currentData.length - 1;
          currentData[last].posts = currentData[last].posts.slice(0, -1);
          return [{ posts: [newPost] }, ...currentData];
        } else {
          return [{ posts: [newPost] }];
        }
      },
      rollbackOnError: true,
    });
    closeModal();
  };

  const createPost = async () => {
    const { createPost } = await client.request(CreatePostDocument, {
      input: post as PostInput,
    });
    if (!createPost.id) throw new Error();
    return posts;
  };

  if (!data?.me) return null;

  return (
    <div className="w-full flex justify-end">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-primary rounded-md p-3 mb-3"
      >
        Create Post
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
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
