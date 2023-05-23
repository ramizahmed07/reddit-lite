import useSWR, { Fetcher } from "swr";

import { MeDocument, User } from "@/gql/graphqlcomponents";
import { client } from "@/lib/clientcomponents";

const fetcher: Fetcher<{ me: User | null }, string> = (query: string) =>
  client.request(query);

export const useMe = () => {
  const { data, error, isLoading } = useSWR(MeDocument, fetcher);

  return { error, isLoading, data };
};
