import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, retainSearchParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { articlesQueryOptions } from "@/api";
import ArticleCard from "@/components/articles/article-card";
import ArticlesPagination from "@/components/articles/articles-pagination";
import ArticlesSearch from "@/components/articles/articles-search";
import { Spinner } from "@/components/spinner";
import { useUpdateNavigate } from "@/hooks/useUpdateNavigate";

export const Route = createFileRoute("/")({
  validateSearch: z.object({
    authorId: z.number().int().positive().optional(),
    limit: z.number().int().positive().optional(),
    page: z.number().int().positive().optional(),
    sort: z.enum(["asc", "desc"]).optional(),
    sortBy: z.enum(["views", "shares"]).optional(),
    search: z.string().optional(),
  }).parse,
  component: ArticlesList,
  loader: ({ context, deps }) => {
    context.queryClient.ensureQueryData(articlesQueryOptions(deps));
  },
  search: {
    middlewares: [
      retainSearchParams([
        "authorId",
        "limit",
        "page",
        "sort",
        "sortBy",
        "search",
      ]),
    ],
  },
  pendingComponent: () => (
    <div className="min-h-[850px] md:min-h-[350px] flex justify-center items-center">
      <Spinner />
    </div>
  ),
});

export default function ArticlesList() {
  const { page, limit } = Route.useSearch();
  const { navigate } = useUpdateNavigate();
  const { data } = useSuspenseQuery(articlesQueryOptions(Route.useSearch()));

  const responseArticles = data.data;
  const { data: articles, total, lastPage } = responseArticles;

  useEffect(() => {
    if (page !== 1 && (page ?? 1) > lastPage) {
      navigate({ page: 1 });
    }
  }, [page, lastPage]);

  useEffect(() => {
    if (!page && !limit) {
      navigate({ page: 1, limit: 10 });
    }
  }, []);

  return (
    <div id="articles-list">
      <h2 className="text-2xl font-semibold mb-4">All Articles ({total})</h2>
      <div className="space-y-6">
        <div className="flex items-center flex-col gap-4 sticky top-0 bg-white z-10 p-4">
          <ArticlesPagination pathname={Route.fullPath} lastPage={lastPage} />
          <ArticlesSearch />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
          {articles.map((article) => (
            <ArticleCard article={article} key={article.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
