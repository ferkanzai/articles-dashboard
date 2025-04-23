import { queryOptions, useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import SpotlightCard from "./spotlight-card";
import type { Article } from "@/api/types";
import { Spinner } from "@/components/spinner";
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
        <Spinner size="large" />
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
    <div className="flex flex-wrap justify-evenly gap-4 lg:gap-0">
        <SpotlightCard article={mostViews} type="mostViewed" />
        <SpotlightCard article={mostShares} type="mostShared" />
    </div>
  );
}
