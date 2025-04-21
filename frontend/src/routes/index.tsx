import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  retainSearchParams
} from "@tanstack/react-router";
import { z } from "zod";
import type { Article } from "@/api/types";
import { api } from "@/api";
import ArticleCard from "@/components/article-card";
import ArticleHighlights from "@/components/article-highlights";
import ArticlesPagination from "@/components/articles-pagination";
import { Separator } from "@/components/ui/separator";

const articlesQueryOptions = (opts: {
  authorId?: string;
  page?: string;
  limit?: string;
  sort?: "asc" | "desc";
  sortBy?: "views" | "shares";
}) =>
  queryOptions({
    queryKey: ["articles", opts],
    queryFn: () => {
      const queryParams = new URLSearchParams(opts);
      return api.get<{
        data: Array<Article>;
        success: boolean;
        count: number;
        hasNextPage: boolean;
        lastPage: number;
        total: number;
      }>(`/articles?${queryParams.toString()}`);
    },
  });

const highlightsArticleQueryOptions = (opts: { authorId?: number }) =>
  queryOptions({
    queryKey: ["articles", "highlights", opts],
    queryFn: () =>
      api.get<{
        data: { mostViews: Article; mostShares: Article };
        success: boolean;
      }>("/articles/highlights", { params: opts }),
  });

export const Route = createFileRoute("/")({
  validateSearch: z.object({
    authorId: z.number().int().positive().optional(),
    limit: z.number().int().positive().optional(),
    page: z.number().int().positive().optional(),
    sort: z.enum(["asc", "desc"]).optional(),
    sortBy: z.enum(["views", "shares"]).optional(),
  }).parse,
  component: App,
  loader: ({ context, deps }) => {
    // context.queryClient.ensureQueryData(highlightsArticleQueryOptions(deps));
    context.queryClient.ensureQueryData(articlesQueryOptions(deps));
  },
  search: {
    middlewares: [
      retainSearchParams(["authorId", "limit", "page", "sort", "sortBy"]),
    ],
  },
});

function App() {
  const { data } = useSuspenseQuery(articlesQueryOptions(Route.useSearch()));
  const { data: highlights } = useSuspenseQuery(highlightsArticleQueryOptions(Route.useLoaderDeps()));

  const responseArticles = data.data;
  const { data: articles, total } = responseArticles;
  const responseHighlights = highlights.data;
  const { data: highlightsArticles } = responseHighlights;

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <h1 className="text-3xl font-bold">Article Dashboard</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
          <ArticleHighlights
            mostViewed={highlightsArticles.mostViews}
            mostShared={highlightsArticles.mostShares}
          />
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            All Articles ({total})
          </h2>
          <div className="space-y-6">
            <ArticlesPagination pathname={Route.fullPath} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article) => (
                <ArticleCard article={article} key={article.id} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
