import { Resolver, Ctx, Mutation, Query, Arg } from "type-graphql";
import argon2 from "argon2";

import { User } from "../entities/User";
import { MyContext } from "src/types";
import { COOKIE_NAME } from "../constants";
import { validateEmail } from "../utils/validateEmail";
import { UserResponse, RegisterUserInput } from "./types/user";
import { validateRegisterInput } from "../utils/validateRegisterInput";

@Resolver(User)
export class UserResolver {
  @Query((_returns) => [User])
  users(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Query((_returns) => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext) {
    if (!req.session.userId) return null;
    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation((_returns) => UserResponse)
  async register(
    @Arg("options") options: RegisterUserInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegisterInput(options);
    if (errors) return { errors };
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, { ...options, password: hashedPassword });
    try {
      await em.persistAndFlush(user);
    } catch (error) {
      console.error(error);
      if ((error.code = "23505")) {
        return {
          errors: [{ field: "", message: "user already exists" }],
        };
      }
    }
    req.session.userId = user.id;
    return { user };
  }

  @Mutation((_returns) => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(
      User,
      validateEmail(usernameOrEmail)
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    );
    if (!user) {
      return {
        errors: [{ field: "username", message: "that username doesn't exist" }],
      };
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [{ field: "password", message: "incorrect password" }],
      };
    }
    req.session.userId = user.id;
    return { user };
  }

  @Mutation((_returns) => Boolean)
  async logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        if (err) return resolve(false);

        res.clearCookie(COOKIE_NAME);
        resolve(true);
      })
    );
  }
}
