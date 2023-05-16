import { MikroORM } from "@mikro-orm/core";
import type { PostgreSqlDriver } from "@mikro-orm/postgresql";

import config from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>(config);
  const em = orm.em.fork();
  // const post = em.create(Post, {
  //   title: "my first post",
  // });
  // await em.persistAndFlush(post);
};

main().catch((err) => {
  console.error(err);
});
