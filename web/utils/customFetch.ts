import { getSessionCookie } from "./getSessionCookie";

interface Options {
  tags?: string[];
  sessionCookie?: boolean | undefined;
}

export const customFetch = (
  url: RequestInfo | URL,
  options: (RequestInit & Options) | undefined
) => {
  const config = { ...options };

  if (options?.tags?.length) {
    config.next = { tags: options?.tags };
  }

  if (options?.sessionCookie) {
    config.headers = {
      "Content-Type": "application/json",
      Cookie: getSessionCookie(),
    };
  }

  return fetch(url, config);
};
