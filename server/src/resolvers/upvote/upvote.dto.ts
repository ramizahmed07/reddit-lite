import { Field, Int, ObjectType } from "type-graphql";

import { Post } from "../post/post.dto";
import { User } from "../user/user.dto";

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
