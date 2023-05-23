import { GetPostsDocument } from "@/gql/graphqlcomponents";
import { client } from "@/lib/clientcomponents";

export const fetchPosts = async () => {
  const { posts } = await client.request(GetPostsDocument);
  return posts;
};

export default async function PostList() {
  const posts = await fetchPosts();
  if (!posts) return <div>Loading...</div>;
  return (
    <div>
      {posts?.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
