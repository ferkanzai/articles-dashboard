import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";

import type { ListRoute } from "./articles.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const articles = await db.query.articles.findMany({
    columns: {
      id: true,
      title: true,
      content: true,
      shares: true,
      views: true,
      created_at: true,
      updated_at: true,
    },
    with: {
      author: {
        columns: {
          name: true,
          id: true,
        },
      },
    },
  });

  return c.json({
    data: articles,
    count: articles.length,
  });
};
