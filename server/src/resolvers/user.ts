import argon2 from "argon2";
import { Resolver, Ctx, Mutation, Query, Arg } from "type-graphql";
import { v4 } from "uuid";

import { User } from "../entities/User";
import { MyContext } from "src/types";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { validateEmail } from "../utils/validateEmail";
import { UserResponse, RegisterUserInput, FieldError } from "./types/user";
import { validateRegisterInput } from "../utils/validateRegisterInput";
import { sendEmail } from "../nodemailer";

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

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { em, redis }: MyContext
  ) {
    const user = await em.findOne(User, { email });
    if (!user) {
      return false;
    }

    try {
      const token = v4();
      await redis.set(
        FORGET_PASSWORD_PREFIX + token,
        user.id,
        "EX",
        1 * 24 * 60 * 60 * 1000 // 3 days
      );
      await sendEmail(
        email,
        `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { em, redis, req }: MyContext
  ) {
    if (newPassword.length <= 5)
      return {
        errors: [
          { field: "newPassword", message: "length must be greater than 5" },
        ],
      };
    const userId = await redis.get(FORGET_PASSWORD_PREFIX + token);
    if (!userId)
      return {
        errors: [
          {
            field: "token",
            message: "token is expired",
          },
        ],
      };

    const user = await em.findOne(User, { id: +userId });
    if (!user)
      return {
        errors: [{ field: "token", message: "user no longer exists" }],
      };

    user.password = await argon2.hash(newPassword);
    await em.persistAndFlush(user);

    req.session.userId = user.id;

    return { user };
  }
}
