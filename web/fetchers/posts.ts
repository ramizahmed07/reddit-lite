import { GetPostsDocument } from "@/gql/graphqlcomponents";
import { client } from "@/lib/clientcomponents";
import { customFetch } from "@/utils/customFetchcomponents";

export const fetchPosts = async (cursor: number | undefined) => {
  client.requestConfig.fetch = (url, options) =>
    customFetch(url, {
      ...options,
      sessionCookie: true,
      tags: ["posts"],
    });

  const { posts } = await client.request(GetPostsDocument, {
    limit: 10,
    ...(cursor && { cursor }),
  });

  return posts;
};
