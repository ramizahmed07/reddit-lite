import Redis from "ioredis";
import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import { createUserLoader } from "./utils/createUserLoader";
export interface MyContext {
  prisma: PrismaClient;
  req: Request & { session: { [key: string]: any } };
  res: Response;
  redis: Redis;
  userLoader: ReturnType<typeof createUserLoader>;
}
