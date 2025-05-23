import { and, asc, count, desc, eq, like, or } from "drizzle-orm";

import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";
import * as schema from "@/db/schema";
import { BAD_REQUEST, NOT_FOUND, OK } from "@/lib/http-status-codes";
import { generateArticleSummary } from "@/services/openai";

import type { GetArticleRoute, ListHighlightsRoute, ListRoute, SummarizeArticleRoute } from "./articles.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const { logger } = c.var;
  const { page, limit, sort, sortBy, authorId, search } = c.req.valid("query");

  logger.debug({
    msg: "Listing articles",
    page,
    limit,
    sort,
    sortBy,
    authorId,
    search,
  });

  const where = [
    authorId ? eq(schema.articles.authorId, authorId) : undefined,
    search ? or(like(schema.articles.title, `% ${search} %`), like(schema.articles.content, `% ${search} %`)) : undefined,
  ].filter(Boolean).reduce((acc, curr) => {
    if (acc && curr) {
      return and(acc, curr);
    }

    if (!acc && curr) {
      return curr;
    }

    return acc;
  }, undefined);

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
      where,
      limit,
      offset: (page - 1) * limit,
      orderBy: sortBy ? [sort === "desc" ? desc(schema.articles[sortBy]) : asc(schema.articles[sortBy])] : undefined,
    }),
    db.select({ count: count() }).from(schema.articles).where(where),
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

  return c.json({
    data: { mostViews, mostShares },
    success: true,
  }, OK);
};

export const getArticle: AppRouteHandler<GetArticleRoute> = async (c) => {
  const { logger } = c.var;
  const { id } = c.req.valid("param");

  logger.debug({
    msg: "Getting article",
    id,
  });

  const article = await db.query.articles.findFirst({
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
    where: eq(schema.articles.id, id),
  });

  if (!article) {
    return c.json({
      message: `Article with id ${id} not found`,
      success: false,
    }, NOT_FOUND);
  }

  return c.json({
    data: article,
    success: true,
  }, OK);
};

export const summarizeArticle: AppRouteHandler<SummarizeArticleRoute> = async (c) => {
  const { logger } = c.var;
  const { id } = c.req.valid("param");

  logger.debug({
    msg: "Summarizing article",
    id,
  });

  const article = await db.query.articles.findFirst({
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
    where: eq(schema.articles.id, id),
  });

  if (!article) {
    return c.json({
      message: `Article with id ${id} not found`,
      success: false,
    }, NOT_FOUND);
  }

  const summary = await generateArticleSummary(c, article);

  return c.json({
    data: {
      summary,
    },
    success: true,
  }, OK);
};
