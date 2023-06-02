import { Field, InputType, Int, ObjectType } from "type-graphql";

import { User } from "../user/user.dto";

@ObjectType()
export class Post {
  @Field((_returns) => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  text: string;

  @Field((_returns) => Int)
  upvotes: number;

  @Field((_returns) => Int)
  downvotes: number;

  @Field((_returns) => Int, { nullable: false })
  userId: number;

  @Field((_returns) => User, { nullable: false })
  user: User;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class PostInput {
  @Field()
  title: string;

  @Field()
  text: string;
}

ObjectType();
export class Upvote {
  @Field(() => Int)
  id: number;

  @Field(() => User, { nullable: false })
  user: User;

  @Field(() => Post, { nullable: false })
  post: Post;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
