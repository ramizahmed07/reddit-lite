import { Post as PostType } from "@/gql/graphqlcomponents";

export default function Post({ post }: { post: PostType }) {
  if (!post) return null;
  return (
    <div className="mb-6 bg-primary rounded-sm p-5">
      <h2 className="mb-4 text-2xl font-bold">{post.title}</h2>
      <p>{post.textSnippet}</p>
      <p>{post.user.username}</p>
      <p>{post.user.email}</p>
    </div>
  );
}
