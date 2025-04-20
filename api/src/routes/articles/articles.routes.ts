import { createRoute, z } from "@hono/zod-openapi";

import { selectArticlesWithAuthorSchema } from "@/db/schema";
import { createErrorSchema, createObjectSchemaWithSuccess, jsonContent } from "@/helpers/schemas";
import { OK, UNPROCESSABLE_ENTITY } from "@/lib/http-status-codes";

const tags = ["Articles"];

const querySchema = z.object({
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
  path: "/articles",
  method: "get",
  request: { query: querySchema },
  tags,
  responses: {
    [OK]: jsonContent(
      createObjectSchemaWithSuccess(
        responseSchema,
        {
          count: 1,
          data: [
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
          ],
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

export type ListRoute = typeof list;
