import { Arg, Ctx, Mutation, Resolver } from "type-graphql";

import { MyContext } from "src/types";
import { Upvote } from "./upvote.dto";

@Resolver(Upvote)
export class UpvoteResolver {
  @Mutation(() => Boolean)
  async upvote(@Arg("id") id: number, @Ctx() { prisma, req }: MyContext) {
    const userId = req?.session?.userId;
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });
    if (!post) return false;
    const where = {
      userId_postId: {
        postId: id,
        userId,
      },
    };
    const upvote = await prisma.upvote.findUnique({
      where,
    });
    try {
      if (upvote) {
        await prisma.upvote.delete({ where });
      } else {
        await prisma.upvote.create({
          data: {
            user: {
              connect: { id: userId },
            },
            post: {
              connect: {
                id,
              },
            },
          },
        });
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
