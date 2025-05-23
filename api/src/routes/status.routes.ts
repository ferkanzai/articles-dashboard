import { createRoute } from "@hono/zod-openapi";

import { createMessageObjectSchema, jsonContent } from "@/helpers/schemas";
import { createRouter } from "@/lib/create-app";
import { OK } from "@/lib/http-status-codes";

const statusRoute = createRoute({
  tags: ["Status"],
  method: "get",
  path: "/",
  responses: {
    [OK]: jsonContent(createMessageObjectSchema("Status"), "Edelman API Status"),
  },
});

const router = createRouter().openapi(statusRoute, (c) => {
  const { logger } = c.var;
  logger.debug({
    msg: "Edelman API status route hit",
    reqId: logger.bindings().reqId,
  });

  return c.json({ message: "OK", success: true }, OK);
});

export default router;
