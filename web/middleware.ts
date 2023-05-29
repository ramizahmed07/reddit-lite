import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { client } from "./lib/client";
import { MeDocument } from "./gql/graphql";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get("sid");

  client.requestConfig.fetch = (url, options) =>
    fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Cookie: `${cookie?.name}=${cookie?.value}`,
      },
    });

  const data = await client.request(MeDocument);
  if (!data?.me?.username) {
    return NextResponse.redirect(new URL(`/login`, request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/",
};
