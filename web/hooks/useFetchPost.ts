import useSWR, { Fetcher } from "swr";

import { GetPostDocument, Post } from "@/gql/graphqlcomponents";
import { client } from "@/lib/clientcomponents";

const fetcher: Fetcher<{ post: Post }, string> = ([query, variables]: any) =>
  client.request(query, variables);

export function useFetchPost(postId: number) {
  const { data, error, isLoading, mutate } = useSWR(
    [GetPostDocument, { postId }],
    fetcher
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}
