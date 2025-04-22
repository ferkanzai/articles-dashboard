import { createRoute, z } from "@hono/zod-openapi";

import { selectAuthorsSchema } from "@/db/schema";
import { createObjectSchemaWithSuccess, jsonContent } from "@/helpers/schemas";
import { OK } from "@/lib/http-status-codes";

const tags = ["Authors"];
const basePath = "/authors";

const dataExample = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Doe" },
];

const responseSchema = z.object({
  count: z.number().positive().int(),
  data: z.array(selectAuthorsSchema),
});

export const list = createRoute({
  path: `${basePath}`,
  method: "get",
  tags,
  responses: {
    [OK]: jsonContent(
      createObjectSchemaWithSuccess(responseSchema, { data: dataExample }),
      "A list of authors",
    ),
  },
});

export type ListRoute = typeof list;
