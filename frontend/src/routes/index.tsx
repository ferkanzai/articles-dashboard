import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  retainSearchParams,
  useNavigate
} from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { articlesQueryOptions } from "@/api";
import ArticleCard from "@/components/articles/article-card";
import ArticlesPagination from "@/components/articles/articles-pagination";
import ArticlesSearch from "@/components/articles/articles-search";
import { Spinner } from "@/components/spinner";

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
      retainSearchParams(["authorId", "limit", "page", "sort", "sortBy", "search"]),
    ],
  },
  pendingComponent: () => <div className="min-h-[850px] md:min-h-[350px] flex justify-center items-center"><Spinner /></div>,
});

export default function ArticlesList() {
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data } = useSuspenseQuery(articlesQueryOptions(Route.useSearch()));

  const responseArticles = data.data;
  const { data: articles, total, lastPage } = responseArticles;

  useEffect(() => {
    if (page !== 1 && (page ?? 1) > lastPage) {
      navigate({
        search: {
          page: 1,
        },
        resetScroll: false,
      });
    }
  }, [page, lastPage]);

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">All Articles ({total})</h2>
      <div className="space-y-6">
        <ArticlesPagination pathname={Route.fullPath} lastPage={lastPage} />
        <ArticlesSearch />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <ArticleCard article={article} key={article.id} />
          ))}
        </div>
      </div>
    </>
  );
}
