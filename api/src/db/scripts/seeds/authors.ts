import type { DBType } from "@/db";

import * as schema from "@/db/schema";

import authors from "./data/authors.json" with { type: "json" };

export default async function seed(db: DBType) {
  await db.insert(schema.authors).values(authors);
}
