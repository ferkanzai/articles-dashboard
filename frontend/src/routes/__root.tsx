import {
  Outlet,
  createRootRouteWithContext
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import TanstackQueryLayout from "../integrations/tanstack-query/layout";
import type { QueryClient } from "@tanstack/react-query";
import ArticleHighlights from "@/components/article-highlights";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <div className="container mx-auto py-6 px-4 space-y-6">
        <h1 className="text-3xl font-bold">Article Dashboard</h1>

        <ArticleHighlights />

        <div className="space-y-8">
          <Outlet />
        </div>
      </div>

      <TanStackRouterDevtools />
      <TanstackQueryLayout />
    </>
  ),
});
