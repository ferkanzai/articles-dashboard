import { createRoute } from "@hono/zod-openapi";

import { createRouter } from "@/lib/create-app";
import { OK } from "@/lib/http-status-codes";
import { createMessageObjectSchema, jsonContent } from "@/helpers/schemas";

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

  return c.json({ message: "OK" }, OK);
});

export default router;
