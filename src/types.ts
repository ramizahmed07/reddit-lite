import { PostgreSqlDriver, SqlEntityManager } from "@mikro-orm/postgresql";

export interface MyContext {
  em: SqlEntityManager<PostgreSqlDriver>;
}
