import { createRoute, z } from "@hono/zod-openapi";

import { selectArticlesWithAuthorSchema } from "@/db/schema";
import { jsonContent } from "@/helpers/schemas";
import { OK } from "@/lib/http-status-codes";

const tags = ["Articles"];

export const list = createRoute({
  path: "/articles",
  method: "get",
  tags,
  responses: {
    [OK]: jsonContent(
      z.object({
        data: z.array(selectArticlesWithAuthorSchema),
        count: z.number().int(),
      }),
      "The list of articles",
    ),
  },
});

export type ListRoute = typeof list;
