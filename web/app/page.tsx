import PostList from "@/components/PostListcomponents";

export default function Home() {
  return (
    <main className="w-1/3 m-auto mt-4">
      {/* @ts-expect-error Server Component */}
      <PostList />
    </main>
  );
}
