import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";
import { OK } from "@/lib/http-status-codes";

import type { ListRoute } from "./authors.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const { logger } = c.var;

  logger.debug({
    msg: "Listing authors",
  });

  const authors = await db.query.authors.findMany();

  return c.json({ success: true, data: authors, count: authors.length }, OK);
};
