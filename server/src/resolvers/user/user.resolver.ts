import argon2 from "argon2";
import { Resolver, Ctx, Mutation, Query, Arg } from "type-graphql";
import { v4 } from "uuid";

import { MyContext } from "src/types";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../../constants";
import { validateEmail } from "../../utils/validateEmail";
import { UserResponse, RegisterUserInput, User } from "./user.dto";
import { validateRegisterInput } from "../../utils/validateRegisterInput";
import { sendEmail } from "../../nodemailer";

@Resolver(User)
export class UserResolver {
  @Query((_returns) => [User])
  users(@Ctx() { prisma }: MyContext): Promise<User[]> {
    return prisma.user.findMany();
  }

  @Query((_returns) => User, { nullable: true })
  async me(@Ctx() { prisma, req }: MyContext): Promise<User | null> {
    if (!req.session.userId) return null;
    const user = await prisma.user.findUnique({
      where: {
        id: +req.session.userId,
      },
    });

    return user;
  }

  @Mutation((_returns) => UserResponse)
  async register(
    @Arg("options") options: RegisterUserInput,
    @Ctx() { prisma, req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegisterInput(options);
    if (errors) return { errors };
    const hashedPassword = await argon2.hash(options.password);

    const user = await prisma.user.findUnique({
      where: {
        username: options?.username,
      },
    });
    if (user)
      return {
        errors: [{ field: "", message: "user already exists" }],
      };
    const newUser = await prisma.user.create({
      data: {
        ...options,
        password: hashedPassword,
      },
    });

    req.session.userId = newUser.id;
    return { user: newUser };
  }

  @Mutation((_returns) => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { prisma, req }: MyContext
  ): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: validateEmail(usernameOrEmail)
        ? {
            email: usernameOrEmail,
          }
        : { username: usernameOrEmail },
    });

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
    @Ctx() { prisma, redis }: MyContext
  ) {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return false;
      }
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
    @Ctx() { prisma, redis, req }: MyContext
  ) {
    if (newPassword.length <= 5)
      return {
        errors: [
          { field: "newPassword", message: "length must be greater than 5" },
        ],
      };
    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId)
      return {
        errors: [
          {
            field: "token",
            message: "token is expired",
          },
        ],
      };
    const user = await prisma.user.findUnique({ where: { id: +userId } });
    if (!user)
      return {
        errors: [{ field: "token", message: "user no longer exists" }],
      };

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: await argon2.hash(newPassword),
      },
    });

    await redis.del(key);

    req.session.userId = user.id;

    return { user };
  }
}
