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
import { Post, PostInput } from "./post.dto";

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

  @FieldResolver(() => Int)
  upvotes(@Root() { id }: Post, @Ctx() { prisma }: MyContext) {
    return prisma.upvote.count({ where: { postId: id } });
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
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { prisma }: MyContext
  ) {
    try {
      const post = await prisma.post.findUnique({ where: { id } });
      if (!post) return false;
      await prisma.post.delete({ where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  }
}
