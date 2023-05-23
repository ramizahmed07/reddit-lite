import PostList from "@/components/PostListcomponents";

export default function Home() {
  return (
    <main>
      {/* @ts-expect-error Server Component */}
      <PostList />
    </main>
  );
}
