import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { MikroORM } from "@mikro-orm/core";
import type { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { buildSchema } from "type-graphql";

import config from "./mikro-orm.config";
import { PostResolver } from "./resolvers/PostResolver";

const main = async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>(config);
  const em = orm.em.fork();

  const schema = await buildSchema({
    resolvers: [PostResolver],
  });

  const server = new ApolloServer({
    schema,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: (): any => ({ em }),
  });

  console.log(`🚀  Server ready at: ${url}`);
};

main().catch((err) => {
  console.error(err);
});
