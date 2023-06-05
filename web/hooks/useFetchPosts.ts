import useSWR, { Fetcher } from "swr";
import useSWRInfinite from "swr/infinite";

import { GetPostsDocument, Post } from "@/gql/graphqlcomponents";
import { client } from "@/lib/clientcomponents";

const fetcher: Fetcher<{ posts: Post[] }, string> = ([query, variables]: any) =>
  client.request(query, variables);

export function useFetchPosts() {
  const { data, error, isLoading, mutate, size, setSize } = useSWRInfinite(
    (_, previousPageData: { posts: Post[] } | null) => {
      const posts = previousPageData?.posts;
      return [
        GetPostsDocument,
        { limit: 10, ...(posts && { cursor: posts[posts.length - 1].id }) },
      ];
    },
    fetcher
  );

  return {
    data,
    error,
    isLoading,
    mutate,
    size,
    setSize,
  };
}
