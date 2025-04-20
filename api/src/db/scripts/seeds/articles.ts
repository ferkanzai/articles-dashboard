import { eq } from "drizzle-orm";

import type { DBType } from "@/db";

import * as schema from "@/db/schema";

import articles from "./data/articles.json" with { type: "json" };

async function getAuthorId(db: DBType, name: string) {
  const foundAuthor = await db.query.authors.findFirst({
    where: eq(schema.authors.name, name),
  });

  if (!foundAuthor) {
    throw new Error(`Author with name ${name} not found`);
  }

  return foundAuthor.id;
}

export default async function seed(db: DBType) {
  await Promise.all(
    articles.map(async (article) => {
      const authorId = await getAuthorId(db, article.author_name);

      await db.insert(schema.articles).values({
        authorId,
        content: article.content,
        shares: article.shares,
        title: article.title,
        views: article.views,
      });
    }),
  );
}
