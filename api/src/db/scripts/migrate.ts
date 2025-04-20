import { migrate } from "drizzle-orm/libsql/migrator";

import db from "@/db";
import env from "@/env";

import config from "../../../drizzle.config";

if (!env.DB_MIGRATING) {
  throw new Error("You must set DB_MIGRATING to \"true\" when running migrations");
}

(async () => {
  await migrate(db, { migrationsFolder: config.out! });
})();
