import { MyContext } from "src/types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";

import { Post } from "./post.dto";

@Resolver(Post)
export class PostResolver {
  @Query((_returns) => [Post])
  posts(@Ctx() { prisma }: MyContext): Promise<Post[]> {
    return prisma.post.findMany();
  }

  @Query((_returns) => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { prisma }: MyContext
  ): Promise<Post | null> {
    return prisma.post.findUnique({ where: { id } });
  }

  @Mutation((_returns) => Post)
  createPost(
    @Arg("title") title: string,
    @Ctx() { prisma }: MyContext
  ): Promise<Post> {
    return prisma.post.create({
      data: {
        title,
      },
    });
  }

  @Mutation((_returns) => Post)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { prisma }: MyContext
  ): Promise<Post | null> {
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
  ): Promise<boolean> {
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
