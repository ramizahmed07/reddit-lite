import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Post {
  @Field((_returns) => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
