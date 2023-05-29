import { fetchPosts } from "@/fetchers/postscomponents";

export default async function PostList() {
  const posts = await fetchPosts();

  return (
    <div className="w-full">
      {posts?.map((post) => (
        <div key={post?.id}>{post?.title}</div>
      ))}
    </div>
  );
}
