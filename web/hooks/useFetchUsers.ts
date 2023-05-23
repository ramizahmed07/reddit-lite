import useSWR, { Fetcher } from "swr";

import { client } from "@/lib/clientcomponents";
import { GetUsersDocument, User } from "@/gql/graphqlcomponents";

const fetcher: Fetcher<{ users: User[] }, string> = (query: string) =>
  client.request(query);

export const useFetchUsers = () => {
  const { data, error, isLoading } = useSWR(GetUsersDocument, fetcher);
  return { data, error, isLoading };
};
