import type { Hook } from "@hono/zod-openapi";
import type { ErrorHandler, NotFoundHandler } from "hono";
import type { ContentfulStatusCode, StatusCode } from "hono/utils/http-status";

import { serveStatic } from "@hono/node-server/serve-static";
import { OpenAPIHono } from "@hono/zod-openapi";
import { requestId } from "hono/request-id";
import { appendTrailingSlash } from "hono/trailing-slash";

import type { AppBindings } from "@/lib/types";

import env from "@/env";
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "@/lib/http-status-codes";
import { connInfoMiddleware } from "@/middlewares/get-conn-info";
import { logger } from "@/middlewares/logger";

const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    return c.json({
      success: result.success,
      error: result.error,
    }, UNPROCESSABLE_ENTITY);
  }
};

const notFound: NotFoundHandler = (c) => {
  return c.json({
    message: `Not Found - ${c.req.path}`,
  }, NOT_FOUND);
};

const onError: ErrorHandler = (err, c) => {
  const currentStatus = "status" in err
    ? err.status
    : c.newResponse(null).status;
  const statusCode = currentStatus !== OK
    ? currentStatus as StatusCode
    : INTERNAL_SERVER_ERROR;

  const environment = c.env?.NODE_ENV || env.NODE_ENV;

  return c.json(
    {
      message: err.message,
      stack: environment === "production"
        ? undefined
        : err.stack,
    },
    statusCode as ContentfulStatusCode,
  );
};

export function createRouter() {
  return new OpenAPIHono<AppBindings>({ strict: false, defaultHook });
}

export default function createApp() {
  const app = createRouter();
  app.use("/api/favicon.ico", serveStatic({ path: "./favicon.ico" }));
  app.use(appendTrailingSlash());
  app.use(requestId());
  app.use(logger());
  app.use(connInfoMiddleware());
  app.notFound(notFound);
  app.onError(onError);

  return app;
}
