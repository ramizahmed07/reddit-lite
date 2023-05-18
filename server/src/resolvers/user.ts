import { Resolver, Ctx, Mutation, Args, Field, ArgsType } from "type-graphql";
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

@Resolver(User)
export class UserResolver {
  @Mutation((_returns) => User)
  async register(
    @Args() { username, password }: RegisterUserInput,
    @Ctx() { em }: MyContext
  ) {
    try {
      const hashedPassword = await argon2.hash(password);
      const user = em.create(User, { username, password: hashedPassword });
      await em.persistAndFlush(user);
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
