import { Field, Int, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field((_returns) => Int)
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;

  password: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class RegisterUserInput {
  @Field((_type) => String)
  username: string;

  @Field((_type) => String)
  email: string;

  @Field((_type) => String)
  password: string;
}

@ObjectType()
export class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
export class UserResponse {
  @Field((_returns) => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field((_returns) => User, { nullable: true })
  user?: User;
}
