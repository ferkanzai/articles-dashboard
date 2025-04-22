import type { z } from "zod";

import { relations, sql } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const timestamps = {
  created_at: t.text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updated_at: t.text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`).$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
};

export const authors = table("authors", {
  id: t.int("id").primaryKey({ autoIncrement: true, onConflict: "fail" }),

  name: t.text("name").notNull(),

  ...timestamps,
}, table => [
  t.uniqueIndex("name_idx").on(table.name),
]);

export const articles = table("articles", {
  id: t.int("id").primaryKey({ autoIncrement: true, onConflict: "fail" }),

  authorId: t.int("author_id").notNull(),
  content: t.text("content").notNull(),
  shares: t.int("likes").notNull().default(0),
  title: t.text("title").notNull(),
  views: t.int("views").notNull().default(0),

  ...timestamps,
}, table => [
  t.uniqueIndex("author_id_title_idx").on(table.authorId, table.title),
  t.index("author_id_idx").on(table.authorId),
  t.index("created_at_idx").on(table.created_at),
]);

export const articlesRelations = relations(articles, ({ one }) => ({
  author: one(authors, { fields: [articles.authorId], references: [authors.id] }),
}));

export const selectAuthorsSchema = createSelectSchema(authors);
export const selectArticlesSchema = createSelectSchema(articles, {
  authorId: schema => schema.int().positive(),
  id: schema => schema.int().positive(),
});
export const selectArticlesWithAuthorSchema = selectArticlesSchema.extend({
  author: selectAuthorsSchema.omit({ created_at: true, updated_at: true }),
}).omit({ authorId: true });
export const insertArticlesSchema = createInsertSchema(articles, {
  authorId: schema => schema.int().positive(),
}).required({ authorId: true, content: true, title: true }).omit({ id: true, created_at: true, updated_at: true });

export type ArticleWithAuthor = z.infer<typeof selectArticlesWithAuthorSchema>;
