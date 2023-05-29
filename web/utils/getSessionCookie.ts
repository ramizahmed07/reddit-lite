import { cookies } from "next/headers";

import { SESSION_COOKIE } from "../contants";

export function getSessionCookie(): string {
  const cookieStore = cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);

  return `${cookie?.name}=${cookie?.value}`;
}
