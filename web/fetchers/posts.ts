import { GetPostsDocument } from "@/gql/graphqlcomponents";
import { client } from "@/lib/clientcomponents";
import { customFetch } from "@/utils/customFetchcomponents";

export const fetchPosts = async () => {
  client.requestConfig.fetch = (url, options) =>
    customFetch(url, {
      ...options,
      sessionCookie: true,
      tags: ["posts"],
    });

  const { posts } = await client.request(GetPostsDocument);

  return posts;
};
