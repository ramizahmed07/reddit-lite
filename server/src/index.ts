import "reflect-metadata";
import http from "http";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import type { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { MikroORM } from "@mikro-orm/core";
import { buildSchema } from "type-graphql";
import { json } from "body-parser";

import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import config from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>(config);
  const em = orm.em.fork();

  const schema = await buildSchema({
    resolvers: [PostResolver, UserResolver],
  });

  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    "/graphql",
    json(),
    expressMiddleware(server, {
      context: (): any => ({ em }),
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/`);
};

main().catch((err) => {
  console.error(err);
});
