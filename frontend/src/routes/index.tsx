import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  retainSearchParams
} from "@tanstack/react-router";
import { z } from "zod";
import ArticleCard from "../components/article-card";
import ArticlesPagination from "../components/articles-pagination";
import { Spinner } from "@/components/spinner";
import { articlesQueryOptions } from "@/api";

export const Route = createFileRoute("/")({
  validateSearch: z.object({
    authorId: z.number().int().positive().optional(),
    limit: z.number().int().positive().optional(),
    page: z.number().int().positive().optional(),
    sort: z.enum(["asc", "desc"]).optional(),
    sortBy: z.enum(["views", "shares"]).optional(),
  }).parse,
  component: ArticlesList,
  loader: ({ context, deps }) => {
    context.queryClient.ensureQueryData(articlesQueryOptions(deps));
  },
  search: {
    middlewares: [
      retainSearchParams(["authorId", "limit", "page", "sort", "sortBy"]),
    ],
  },
  pendingComponent: () => <div className="min-h-16 flex justify-center items-center"><Spinner /></div>,
});

export default function ArticlesList() {
  const { data } = useSuspenseQuery(articlesQueryOptions(Route.useSearch()));

  const responseArticles = data.data;
  const { data: articles, total } = responseArticles;

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">All Articles ({total})</h2>
      <div className="space-y-6">
        <ArticlesPagination pathname={Route.fullPath} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <ArticleCard article={article} key={article.id} />
          ))}
        </div>
      </div>
    </>
  );
}
