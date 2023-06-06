import { User } from "@prisma/client";
import { prisma } from "../lib/prisma";
import DataLoader from "dataloader";

export function createUserLoader() {
  return new DataLoader<number, User>(async (userIds) => {
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds as number[],
        },
      },
    });

    const userIdToUser: Record<number, User> = {};

    users.forEach((u) => {
      userIdToUser[u.id] = u;
    });

    return userIds.map((userId) => userIdToUser[userId]);
  });
}
