import useSWR, { Fetcher } from "swr";
// import { redirect } from "next/navigation";

import { MeDocument, User } from "@/gql/graphqlcomponents";
import { client } from "@/lib/clientcomponents";

const fetcher: Fetcher<{ me: User | null }, string> = (query: string) =>
  client.request(query);

export const useMe = () => {
  const { data, error, isLoading } = useSWR(MeDocument, fetcher);
  console.log("hNELO", { data, error });
  // if (error || !data?.me) redirect("/login");
  return { error, isLoading, data };
};
