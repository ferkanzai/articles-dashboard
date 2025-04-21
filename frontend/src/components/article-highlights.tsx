import { queryOptions, useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import ArticleCard from "./article-card";
import { Spinner } from "./spinner";
import type { Article } from "@/api/types";
import { api } from "@/api";

const highlightsArticleQueryOptions = (opts: { authorId?: number }) =>
  queryOptions({
    queryKey: ["articles", "highlights", opts],
    queryFn: () =>
      api.get<{
        data: { mostViews: Article; mostShares: Article };
        success: boolean;
      }>("/articles/highlights", { params: opts }),
  });

export default function ArticleHighlights() {
  const search = useSearch({ from: "/" });
  const {
    data: highlights,
    isError,
    isLoading,
    isFetching,
    isPending,
  } = useQuery(highlightsArticleQueryOptions({ authorId: search.authorId }));

  const loading = isLoading || isFetching || isPending;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[630px] sm:min-h-[300px]">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return <div className="flex justify-center items-center h-full">Error</div>;
  }

  const responseHighlights = highlights.data;
  const { data: highlightsArticles } = responseHighlights;
  const { mostShares, mostViews } = highlightsArticles;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Most Viewed</h3>
        <ArticleCard article={mostViews} highlight />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">Most Shared</h3>
        <ArticleCard article={mostShares} highlight />
      </div>
    </div>
  );
}
