import { asc, count, desc } from "drizzle-orm";

import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";
import * as schema from "@/db/schema";
import { OK } from "@/lib/http-status-codes";

import type { ListRoute } from "./articles.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const { logger } = c.var;
  const { page, limit, sort, sortBy } = c.req.valid("query");

  logger.debug({
    msg: "Listing articles",
    page,
    limit,
  });

  const [articles, [total]] = await Promise.all([
    db.query.articles.findMany({
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
      limit,
      offset: (page - 1) * limit,
      orderBy: sortBy ? [sort === "desc" ? desc(schema.articles[sortBy]) : asc(schema.articles[sortBy])] : undefined,
    }),
    db.select({ count: count() }).from(schema.articles),
  ]);

  const totalCount = total?.count ?? 0;
  const hasNextPage = totalCount > page * limit;

  return c.json({
    count: articles.length,
    data: articles,
    hasNextPage,
    lastPage: Math.ceil(totalCount / limit),
    success: true,
    total: totalCount,
  }, OK);
};
