import { getConnInfo } from "@hono/node-server/conninfo";
import { createMiddleware } from "hono/factory";

import type { AppBindings } from "@/lib/types";

export function connInfoMiddleware() {
  return createMiddleware<AppBindings>(async (c, next) => {
    const { logger, requestId } = c.var;
    const connInfo = getConnInfo(c);

    c.set("connInfo", connInfo);
    logger.assign({ connInfo, reqId: requestId });

    return next();
  });
}
