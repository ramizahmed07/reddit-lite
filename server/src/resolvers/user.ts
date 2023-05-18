import {
  Resolver,
  Ctx,
  Mutation,
  Args,
  Field,
  ArgsType,
  ObjectType,
} from "type-graphql";
import argon2 from "argon2";

import { User } from "../entities/User";
import { MyContext } from "src/types";

@ArgsType()
class RegisterUserInput {
  @Field((_type) => String)
  username: string;

  @Field((_type) => String)
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field((_returns) => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field((_returns) => User, { nullable: true })
  user?: User;
}

function setError(field: string, message: string): FieldError {
  return {
    field,
    message,
  };
}

@Resolver(User)
export class UserResolver {
  @Mutation((_returns) => UserResponse)
  async register(
    @Args() { username, password }: RegisterUserInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (username.length <= 2)
      return {
        errors: [setError("username", "length must be greater than 2")],
      };
    if (password.length <= 3)
      return {
        errors: [setError("password", "length must be greater than 3")],
      };

    const hashedPassword = await argon2.hash(password);
    const user = em.create(User, { username, password: hashedPassword });
    try {
      await em.persistAndFlush(user);
    } catch (error) {
      if ((error.code = "23505")) {
        return {
          errors: [setError("username", "username is already taken")],
        };
      }
    }
    return { user };
  }

  @Mutation((_returns) => UserResponse)
  async login(
    @Args() { username, password }: RegisterUserInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username });
    if (!user) {
      return {
        errors: [setError("username", "that username doesn't exist")],
      };
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [setError("password", "incorrect password")],
      };
    }

    return { user };
  }
}
