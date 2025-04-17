import { createRoute } from "@hono/zod-openapi";

import { createMessageObjectSchema, jsonContent } from "@/helpers/schemas";
import { createRouter } from "@/lib/create-app";
import { OK } from "@/lib/http-status-codes";

const indexRoute = createRoute({
  tags: ["Index"],
  method: "get",
  path: "/",
  responses: {
    [OK]: jsonContent(createMessageObjectSchema("Edelman API"), "Edelman API Index"),
  },
});

const router = createRouter().openapi(indexRoute, (c) => {
  const { logger } = c.var;
  logger.debug({ msg: "Edelman API Index route hit", reqId: logger.bindings().reqId });

  return c.json({ message: "Edelman API" }, OK);
});

export default router;
