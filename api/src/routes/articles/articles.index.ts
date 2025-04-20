import { createRouter } from "@/lib/create-app";

import * as handlers from "./articles.handlers";
import * as routes from "./articles.routes";

const router = createRouter().openapi(routes.list, handlers.list);

export default router;
