import { PostgreSqlDriver, SqlEntityManager } from "@mikro-orm/postgresql";
import { Request, Response } from "express";

export interface MyContext {
  em: SqlEntityManager<PostgreSqlDriver>;
  req: Request & { session: { [key: string]: any } };
  res: Response;
}
