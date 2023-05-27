import Redis from "ioredis";
import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
export interface MyContext {
  prisma: PrismaClient;
  req: Request & { session: { [key: string]: any } };
  res: Response;
  redis: Redis;
}
