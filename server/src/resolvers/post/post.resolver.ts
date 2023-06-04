import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";

import { isAuth } from "../../middlewares/isAuth";
import { MyContext } from "src/types";
import { Post, PostInput, Vote } from "./post.dto";

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() { text }: Post) {
    return text.slice(0, 50);
  }

  @FieldResolver()
  user(@Root() { userId }: Post, @Ctx() { prisma }: MyContext) {
    return prisma.user.findUnique({ where: { id: userId } });
  }

  @FieldResolver()
  isMine(@Root() { userId }: Post, @Ctx() { req }: MyContext) {
    return userId === req?.session?.userId;
  }

  @FieldResolver()
  async voteStatus(@Root() { id }: Post, @Ctx() { prisma, req }: MyContext) {
    let status: string = "";
    const userId = req?.session?.userId;
    const upvote = await prisma.upvote.findUnique({
      where: {
        userId_postId: {
          postId: id,
          userId,
        },
      },
    });
    const downvote = await prisma.downvote.findUnique({
      where: {
        userId_postId: {
          postId: id,
          userId,
        },
      },
    });
    if (upvote) status = "upvoted";
    else if (downvote) status = "downvoted";
    return status;
  }

  @FieldResolver(() => Int)
  async votes(@Root() { id }: Post, @Ctx() { prisma }: MyContext) {
    const upvotes = await prisma.upvote.count({
      where: { postId: id },
    });
    const downvotes = await prisma.downvote.count({
      where: { postId: id },
    });
    return upvotes - downvotes;
  }

  @Query((_returns) => [Post])
  @UseMiddleware(isAuth)
  posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => Int, { nullable: true }) cursor: number | null,
    @Ctx() { prisma }: MyContext
  ) {
    const take = Math.min(50, limit);
    return prisma.post.findMany({
      take,
      skip: cursor ? 1 : 0,
      ...(cursor && { cursor: { id: cursor } }),
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  @Query((_returns) => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number, @Ctx() { prisma }: MyContext) {
    return prisma.post.findUnique({ where: { id } });
  }

  @Mutation((_returns) => Post)
  @UseMiddleware(isAuth)
  createPost(
    @Arg("input") input: PostInput,
    @Ctx() { prisma, req }: MyContext
  ) {
    return prisma.post.create({
      data: {
        ...input,
        userId: req.session.userId,
      },
    });
  }

  @Mutation((_returns) => Post)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { prisma }: MyContext
  ) {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) return null;

    if (typeof title !== undefined) {
      return prisma.post.update({
        where: { id },
        data: {
          title,
        },
      });
    }
    return post;
  }

  @Mutation((_returns) => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { prisma, req }: MyContext
  ) {
    const userId = req?.session?.userId;
    // await new Promise((res) =>
    //   setTimeout(() => {
    //     res(true);
    //   }, 4000)
    // );
    try {
      const post = await prisma.post.findUnique({ where: { id } });
      if (!post) return false;
      if (post?.userId !== userId) return false;
      await prisma.post.delete({ where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  }

  @Mutation(() => Boolean)
  upvote(@Arg("id", () => Int) id: number, @Ctx() ctx: MyContext) {
    return this.vote({ ctx, type: Vote.Upvote, postId: id });
  }

  @Mutation(() => Boolean)
  downvote(@Arg("id", () => Int) id: number, @Ctx() ctx: MyContext) {
    return this.vote({ ctx, type: Vote.Downvote, postId: id });
  }

  async vote({
    type,
    postId,
    ctx,
  }: {
    type: Vote;
    postId: number;
    ctx: MyContext;
  }) {
    const { prisma, req } = ctx;
    const userId = req?.session?.userId;
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) return false;

    const where = {
      userId_postId: {
        postId,
        userId,
      },
    };
    const data = {
      user: {
        connect: { id: userId },
      },
      post: {
        connect: {
          id: postId,
        },
      },
    };
    let status: Vote | null = null;
    const upvote = await prisma.upvote.findUnique({
      where,
    });

    const downvote = await prisma.downvote.findUnique({
      where,
    });

    if (upvote) status = Vote.Upvote;
    else if (downvote) status = Vote.Downvote;
    // status = upvote
    try {
      if (status !== null) {
        if (status === Vote.Downvote) {
          await prisma.downvote.delete({ where });
          if (type === Vote.Upvote) {
            await prisma.upvote.create({
              data,
            });
          }
        } else {
          await prisma.upvote.delete({ where });
          if (type === Vote.Downvote) {
            await prisma.downvote.create({
              data,
            });
          }
        }
      } else {
        if (type === Vote.Downvote) {
          await prisma.downvote.create({
            data,
          });
        } else {
          await prisma.upvote.create({
            data,
          });
        }
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
