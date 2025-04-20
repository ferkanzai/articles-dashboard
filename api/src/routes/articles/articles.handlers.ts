import { asc, count, desc, eq } from "drizzle-orm";

import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";
import * as schema from "@/db/schema";
import { BAD_REQUEST, OK } from "@/lib/http-status-codes";

import type { ListHighlightsRoute, ListRoute } from "./articles.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const { logger } = c.var;
  const { page, limit, sort, sortBy, authorId } = c.req.valid("query");

  logger.debug({
    msg: "Listing articles",
    page,
    limit,
  });

  const [articles, [total]] = await Promise.all([
    db.query.articles.findMany({
      columns: {
        authorId: false,
      },
      with: {
        author: {
          columns: {
            name: true,
            id: true,
          },
        },
      },
      where: authorId ? eq(schema.articles.authorId, authorId) : undefined,
      limit,
      offset: (page - 1) * limit,
      orderBy: sortBy ? [sort === "desc" ? desc(schema.articles[sortBy]) : asc(schema.articles[sortBy])] : undefined,
    }),
    db.select({ count: count() }).from(schema.articles).where(authorId ? eq(schema.articles.authorId, authorId) : undefined),
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

export const listHighlights: AppRouteHandler<ListHighlightsRoute> = async (c) => {
  const { logger } = c.var;
  const { authorId } = c.req.valid("query");

  logger.debug({
    msg: "Listing highlights",
    authorId,
  });

  const [mostShares, mostViews] = await Promise.all([
    db.query.articles.findFirst({
      columns: {
        authorId: false,
      },
      with: {
        author: {
          columns: {
            name: true,
            id: true,
          },
        },
      },
      where: authorId ? eq(schema.articles.authorId, authorId) : undefined,
      orderBy: [desc(schema.articles.shares)],
    }),
    db.query.articles.findFirst({
      columns: {
        authorId: false,
      },
      with: {
        author: {
          columns: {
            name: true,
            id: true,
          },
        },
      },
      where: authorId ? eq(schema.articles.authorId, authorId) : undefined,
      orderBy: [desc(schema.articles.views)],
    }),
  ]);

  if (!mostShares || !mostViews) {
    return c.json({
      message: `Author with id ${authorId} has no highlights`,
      success: false,
    }, BAD_REQUEST);
  }

  const data = [mostShares, mostViews].map((article, index) => ({
    ...article,
    highlight: index === 0 ? "shares" : "views" as "shares" | "views",
  }));

  return c.json({
    data,
    success: true,
  }, OK);
};
