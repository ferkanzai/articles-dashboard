import type { Table } from "drizzle-orm";

import { getTableName, sql } from "drizzle-orm";

import type { DBType } from "@/db";

import * as database from "@/db";
import * as schema from "@/db/schema";
import * as seeds from "@/db/scripts/seeds";
import env from "@/env";

if (!env.DB_SEED) {
  throw new Error("You must set DB_SEED to \"true\" when running seeds");
}

async function resetTable(db: DBType, table: Table) {
  const tableName = getTableName(table);

  await db.run(sql.raw(`DELETE FROM ${tableName}`));
  // Reset ID sequence to start at 1
  await db.run(sql.raw(`DELETE FROM sqlite_sequence WHERE name='${tableName}'`));

  return true;
}

(async () => {
  for (const table of [
    schema.articles,
    schema.authors,
  ]) {
    await resetTable(database.default, table);
  }

  await seeds.authors(database.default);
  await seeds.articles(database.default);
})();
