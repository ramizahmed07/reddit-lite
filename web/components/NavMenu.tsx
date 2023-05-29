import Link from "next/link";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { CreatePostDocument, Post } from "@/gql/graphqlcomponents";
import { client } from "@/lib/clientcomponents";
import { customFetch } from "@/utils/customFetchcomponents";
import NavLinks from "./NavLinks";
import CreatePostModal from "./CreatePostModal";

export default async function NavMenu() {
  const createPost = async (post: Post) => {
    "use server";
    try {
      client.requestConfig.fetch = (url, options) =>
        customFetch(url, { ...options, sessionCookie: true });

      await client.request(CreatePostDocument, {
        input: { ...post },
      });

      revalidateTag("posts");
    } catch (error) {
      redirect("/login");
    }
  };

  return (
    <header className="flex justify-between items-center  px-5 h-14 bg-primary border-b border-border">
      <div className={`font-ibm text-3xl`}>
        <Link href="/">reddit-lite</Link>
      </div>
      <div className="flex items-center justify-between">
        <CreatePostModal createPost={createPost} />

        <NavLinks />
      </div>
    </header>
  );
}
