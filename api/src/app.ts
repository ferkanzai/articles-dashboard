import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import articles from "@/routes/articles/articles.index";
import index from "@/routes/index.routes";
import status from "@/routes/status.routes";

const app = createApp();

configureOpenAPI(app);

app.route("/health", status);

const routes = [
  index,
  articles,
] as const;

routes.forEach((route) => {
  app.route("/api", route);
});

export type AppType = typeof routes[number];
export default app;
