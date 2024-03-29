"use client";

import { useFetchPosts } from "@/hooks/useFetchPostscomponents";
import Post from "./Post";
import CreatePost from "./CreatePost";

export default function PostList() {
  const { data, error, isLoading, setSize, size } = useFetchPosts();
  if (isLoading) return <div className="w-full">Loading...</div>;
  if (error) return <div className="w-full">Something went wrong</div>;

  return (
    <div className="w-full">
      <CreatePost />

      {data && data.length > 0 ? (
        <>
          {data?.map((item) =>
            item?.posts.map((post) => <Post key={post?.id} post={post} />)
          )}

          <div
            onClick={() => {
              setSize(size + 1);
            }}
            className="bg-primary cursor-pointer rounded-md p-3 mb-3 w-fit m-auto"
          >
            Load More
          </div>
        </>
      ) : (
        <div>No posts to show</div>
      )}
    </div>
  );
}
