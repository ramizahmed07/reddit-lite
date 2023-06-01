import useSWR, { Fetcher } from "swr";
import useSWRInfinite from "swr/infinite";

import { GetPostsDocument, Post } from "@/gql/graphqlcomponents";
import { client } from "@/lib/clientcomponents";

const fetcher: Fetcher<{ posts: Post[] }, string> = ([query, variables]: any) =>
  client.request(query, variables);

export default function useFetchPosts() {
  const { data, error, isLoading, mutate, size, setSize } = useSWRInfinite(
    (
      pageIndex: number,
      previousPageData: { posts: Post[] } | null // use a type here that has nextToken and list of items returned by your graphql
    ) => {
      console.log({ pageIndex, previousPageData });
      const posts = previousPageData?.posts;

      // reached the end
      // if (previousPageData && !previousPageData.nextToken) return null;

      // const query = GetPostsDocument;
      // first page, we don't have `previousPageData`
      // if (pageIndex === 0) return [query];

      // add the cursor to the API endpoint
      return [
        GetPostsDocument,
        { limit: 10, ...(posts && { cursor: posts[posts.length - 1].id }) },
      ];
    },
    fetcher
  );

  console.log("DATA", data);

  return {
    data: data?.map((item) => item?.posts.map((post) => post)).flat() || [],
    error,
    isLoading,
    mutate,
    size,
    setSize,
  };
}
