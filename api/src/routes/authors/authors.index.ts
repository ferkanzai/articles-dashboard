import { createRouter } from "@/lib/create-app";

import * as handlers from "./authors.handlers";
import * as routes from "./authors.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list);

export default router;
