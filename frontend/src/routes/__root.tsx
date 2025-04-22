import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Suspense } from "react";
import TanstackQueryLayout from "../integrations/tanstack-query/layout";
import type { QueryClient } from "@tanstack/react-query";
import ArticleHighlights from "@/components/article-highlights";
import FilterSidebar from "@/components/filters";
import { Spinner } from "@/components/spinner";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <div className="container mx-auto py-6 px-4 space-y-6">
        <h1 className="text-3xl font-bold">Article Dashboard</h1>

        <div className="flex flex-col gap-4">
          <Suspense fallback={<div className="w-40 flex justify-center items-center"><Spinner /></div>}>
            <FilterSidebar />
          </Suspense>

          <div className="">
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
