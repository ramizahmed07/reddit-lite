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
  @FieldResolver()
  user(@Root() { userId }: Post, @Ctx() { prisma }: MyContext) {
    return prisma.user.findUnique({ where: { id: userId } });
  }

  @Query((_returns) => [Post])
  posts(@Ctx() { prisma }: MyContext) {
    return prisma.post.findMany();
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
    console.log("CreatePost >", req.session.userId);
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
