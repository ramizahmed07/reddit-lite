import { MeDocument, User } from "@/gql/graphqlcomponents";
import { client } from "@/lib/clientcomponents";
import { customFetch } from "@/utils/customFetchcomponents";

export async function fetchMe() {
  client.requestConfig.fetch = (url, options) =>
    customFetch(url, { ...options, sessionCookie: true, tags: ["me"] });
  const { me } = await client.request(MeDocument);
  return me as User;
}
