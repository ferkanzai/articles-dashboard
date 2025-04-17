import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import status from "@/routes/status.routes";
import index from "@/routes/index.routes";

const app = createApp();

configureOpenAPI(app);

app.route("/", status);

const routes = [
  index,
] as const;

routes.forEach((route) => {
  app.route("/api", route);
});

export type AppType = typeof routes[number];
export default app;
