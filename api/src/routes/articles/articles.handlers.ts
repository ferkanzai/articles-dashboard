import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";

import type { ListRoute } from "./articles.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const articles = await db.query.articles.findMany();
  return c.json(articles);
};
