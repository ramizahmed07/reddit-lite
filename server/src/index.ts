import "reflect-metadata";
import http from "http";
import express from "express";
import RedisStore from "connect-redis";
import cors from "cors";
import session from "express-session";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import type { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { MikroORM } from "@mikro-orm/core";
import { buildSchema } from "type-graphql";
import { json } from "body-parser";
import { createClient } from "redis";

import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { COOKIE_NAME, __prod__ } from "./constants";
import config from "./mikro-orm.config";
import { User } from "./entities/User";

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

  const redisClient = createClient();
  redisClient.connect().catch(console.error);

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new (RedisStore as any)({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // 10 years
        httpOnly: true,
        sameSite: "strict", // csrf
        secure: __prod__, // cookie only works in https
      },
      resave: false,
      saveUninitialized: false,
      secret: "sdlkfjdsklfjdslkf",
    })
  );

  app.use(
    "/graphql",
    json(),
    expressMiddleware(server, {
      context: ({ req, res }): any => ({ em, req, res }),
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
