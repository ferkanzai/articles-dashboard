import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Suspense } from "react";
import TanstackQueryLayout from "../integrations/tanstack-query/layout";
import type { QueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/spinner";
import Filters from "@/components/filters";
import ArticleHighlights from "@/components/articles/article-highlights";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <div className="container mx-auto py-6 px-4 space-y-6 max-w-7xl">
        <h1 className="text-3xl font-bold">Article Dashboard</h1>

        <Suspense fallback={<Spinner size="small" />}>
          <Filters />
        </Suspense>
        <div className="flex flex-col gap-4">
          <div>
            <ArticleHighlights />
          </div>
        </div>

        <div className="space-y-8">
          <Outlet />
        </div>
      </div>

      <TanStackRouterDevtools />
      <TanstackQueryLayout />
    </>
  ),
});
