import { AiOutlineDelete } from "react-icons/ai";

import { DeletePostDocument } from "@/gql/graphqlcomponents";
import { client } from "@/lib/clientcomponents";
import { Posts } from "@/typescomponents";
import { useFetchPosts } from "@/hooks/useFetchPostscomponents";

interface Props {
  postId: number;
  closeMenu: () => void;
}

const getOptimisticData = (currentData: Posts[] | undefined, id: number) =>
  currentData?.map((item) => ({
    ...item,
    posts: item.posts.filter((post) => post?.id !== id),
  })) || [];

export default function DeletePost({ postId, closeMenu }: Props) {
  const { data: posts, mutate } = useFetchPosts();

  const deletePost = () => {
    closeMenu();
    mutate(
      async () => {
        const { deletePost } = await client.request(DeletePostDocument, {
          id: postId,
        });
        if (!deletePost) throw new Error();
        return getOptimisticData(posts, postId);
      },
      {
        optimisticData(currentData?) {
          return getOptimisticData(currentData, postId);
        },
        revalidate: false,
      }
    );
  };

  return (
    <button
      onClick={deletePost}
      className="p-2 [&>svg]:mr-[6px] hover:bg-light-blue hover:text-white"
    >
      <AiOutlineDelete size={20} /> Delete
    </button>
  );
}
