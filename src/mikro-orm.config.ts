import path from "path";
import { Options } from "@mikro-orm/core";
import type { PostgreSqlDriver } from "@mikro-orm/postgresql";

import { __prod__ } from "./constants";
import { Post } from "./entities/Post";

const config: Options<PostgreSqlDriver> = {
  entities: [Post],
  dbName: "reddit-lite",
  type: "postgresql",
  user: "postgres",
  password: "ramiz123",
  debug: !__prod__,
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pathTs: undefined,
    glob: "!(*.d).{js,ts}",
  },
};

export default config;
