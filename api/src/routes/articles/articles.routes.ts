import { createRoute, z } from "@hono/zod-openapi";

import { selectArticlesWithAuthorSchema } from "@/db/schema";
import { createErrorSchema, createObjectSchemaWithSuccess, idParamsSchema, jsonContent } from "@/helpers/schemas";
import { BAD_REQUEST, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "@/lib/http-status-codes";

const tags = ["Articles"];
const basePath = "/articles";

const dataExample = [
  {
    content: "Article 1 content",
    created_at: "2021-01-01",
    id: 1,
    shares: 10,
    title: "Article 1",
    updated_at: "2021-01-01",
    views: 100,
    author: {
      id: 1,
      name: "John Doe",
    },
  },
];

const querySchema = z.object({
  authorId: z.coerce.number().int().positive().optional().openapi({
    example: 3,
    param: {
      name: "authorId",
      description: "The author id to filter articles from. If not provided, articles from all authors will be returned",
      required: false,
    },
  }),
  page: z.coerce.number().int().positive().default(1).openapi({
    example: 3,
    param: {
      name: "page",
      description: "The page number",
      required: false,
    },
  }),
  limit: z.coerce.number().int().positive().default(10).openapi({
    example: 20,
    param: {
      name: "limit",
      description: "The number of items per page",
      required: false,
    },
  }),
  sort: z.enum(["asc", "desc"]).optional().default("desc").openapi({
    example: "desc",
    param: {
      name: "sort",
      description: "The sort order",
      required: false,
    },
  }),
  sortBy: z.enum(["shares", "views"]).optional().openapi({
    example: "shares",
    param: {
      name: "sortBy",
      description: "The field to sort by",
      required: false,
    },
  }),
  search: z.string().optional().openapi({
    example: "Article 1",
    param: {
      name: "search",
      description: "The search query",
    },
  }),
}).openapi({
  description: "Query parameters for the articles list",
  example: {
    page: 1,
    limit: 10,
  },
});

const responseSchema = z.object({
  count: z.number().positive().int(),
  data: z.array(selectArticlesWithAuthorSchema),
  hasNextPage: z.boolean(),
  lastPage: z.number().positive().int(),
  total: z.number().positive().int(),
});

export const list = createRoute({
  path: `${basePath}`,
  method: "get",
  request: { query: querySchema },
  tags,
  responses: {
    [OK]: jsonContent(
      createObjectSchemaWithSuccess(
        responseSchema,
        {
          count: 1,
          data: dataExample,
          hasNextPage: false,
          lastPage: 1,
          total: 1,
        },
      ),
      "A paginated list of articles",
    ),
    [UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(querySchema), "Validation error(s)"),
  },
});

const highlightsResponseSchema = z.object({
  data: z.object({
    mostShares: selectArticlesWithAuthorSchema,
    mostViews: selectArticlesWithAuthorSchema,
  }),
});

const queryHighlightsSchema = z.object({
  authorId: z.coerce.number().int().positive().optional().openapi({
    example: 3,
    param: {
      name: "authorId",
      description: "The author id to get the highlights from. If not provided, the highlights will be the articles with the highest shares and views",
      required: false,
    },
  }),
}).openapi({
  description: "Query parameters for the highlights list",
  example: {
    authorId: 1,
  },
});

export const listHighlights = createRoute({
  path: `${basePath}/highlights`,
  method: "get",
  request: { query: queryHighlightsSchema },
  tags,
  responses: {
    [OK]: jsonContent(createObjectSchemaWithSuccess(highlightsResponseSchema, { data: dataExample }), "A list of article with highest shares and views"),
    [BAD_REQUEST]: jsonContent(createObjectSchemaWithSuccess(z.object({
      message: z.string(),
    }), {
      message: "Author id has not highlights",
      success: false,
    }), "Author id has not highlights"),
    [UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(queryHighlightsSchema), "Validation error(s)"),
  },
});

export const getArticle = createRoute({
  path: `${basePath}/{id}`,
  method: "get",
  request: {
    params: idParamsSchema,
  },
  tags,
  responses: {
    [OK]: jsonContent(createObjectSchemaWithSuccess(z.object({ data: selectArticlesWithAuthorSchema }), dataExample[0]), "A single article"),
    [NOT_FOUND]: jsonContent(createObjectSchemaWithSuccess(z.object({
      message: z.string(),
    }), {
      message: "Article not found",
      success: false,
    }), "Article not found"),
    [UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(idParamsSchema), "Invalid id error"),
  },
});

export const summarizeArticle = createRoute({
  path: `${basePath}/{id}/summarize`,
  method: "post",
  request: {
    params: idParamsSchema,
  },
  tags,
  responses: {
    [OK]: jsonContent(createObjectSchemaWithSuccess(z.object({
      data: z.object({
        summary: z.string(),
      }),
    }), {
      data: {
        summary: "Article summary",
      },
    }), "Article summarized"),
    [NOT_FOUND]: jsonContent(createObjectSchemaWithSuccess(z.object({
      message: z.string(),
    }), {
      message: "Article not found",
      success: false,
    }), "Article not found"),
    [UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(idParamsSchema), "Invalid id error"),
  },
});

export type ListRoute = typeof list;
export type ListHighlightsRoute = typeof listHighlights;
export type GetArticleRoute = typeof getArticle;
export type SummarizeArticleRoute = typeof summarizeArticle;
