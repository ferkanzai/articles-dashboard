import { drizzle } from "drizzle-orm/libsql";

import * as schema from "@/db/schema";
import env from "@/env";

export const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
  },
  casing: "snake_case",
  schema,
  logger: true,
});

export type DBType = typeof db;

export default db;
