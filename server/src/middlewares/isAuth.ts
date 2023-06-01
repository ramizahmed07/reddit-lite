import { MiddlewareFn } from "type-graphql";

import { MyContext } from "src/types";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  console.log("CONTEXT", context?.req?.session?.userId);
  if (!context?.req?.session?.userId) throw new Error("not authenticated");

  await next();
};
