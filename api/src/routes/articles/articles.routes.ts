import { createRoute, z } from "@hono/zod-openapi";

import { selectArticlesSchema } from "@/db/schema";
import { jsonContent } from "@/helpers/schemas";
import { OK } from "@/lib/http-status-codes";

const tags = ["Articles"];

export const list = createRoute({
  path: "/articles",
  method: "get",
  tags,
  responses: {
    [OK]: jsonContent(
      z.array(selectArticlesSchema),
      "The list of articles",
    ),
  },
});

export type ListRoute = typeof list;
