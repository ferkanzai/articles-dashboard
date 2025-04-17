import { createRoute } from "@hono/zod-openapi";

import { createRouter } from "@/lib/create-app";
import { createMessageObjectSchema, jsonContent } from "@/helpers/schemas";
import { OK, UNAUTHORIZED } from "@/lib/http-status-codes";

const indexRoute = createRoute({
  tags: ["Index"],
  method: "get",
  path: "/",
  responses: {
    [OK]: jsonContent(createMessageObjectSchema("Edelman API"), "Edelman API Index"),
    [UNAUTHORIZED]: jsonContent(createMessageObjectSchema("Unauthorized"), "Unauthorized"),
  },
});

const router = createRouter().openapi(indexRoute, (c) => {
  const { logger } = c.var;
  logger.debug({ msg: "Edelman API Index route hit", reqId: logger.bindings().reqId });

  return c.json({ message: "Edelman API" }, OK);
});

export default router;
