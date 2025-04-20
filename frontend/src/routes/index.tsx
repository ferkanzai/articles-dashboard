import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { Article } from "@/api/types";
import { api } from "@/api";
import ArticleCard from "@/components/article-card";
import ArticleHighlights from "@/components/article-highlights";
import { Separator } from "@/components/ui/separator";

const articlesQueryOptions = queryOptions({
  queryKey: ["articles"],
  queryFn: () =>
    api.get<{ data: Array<Article>; success: boolean }>("/articles"),
});

const highlightsArticleQueryOptions = queryOptions({
  queryKey: ["articles", "highlights"],
  queryFn: () =>
    api.get<{
      data: { mostViews: Article; mostShares: Article };
      success: boolean;
    }>("/articles/highlights"),
});

export const Route = createFileRoute("/")({
  component: App,
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(highlightsArticleQueryOptions);
    context.queryClient.ensureQueryData(articlesQueryOptions);
  },
});

function App() {
  const { data } = useSuspenseQuery(articlesQueryOptions);
  const { data: highlights } = useSuspenseQuery(highlightsArticleQueryOptions);

  const responseArticles = data.data;
  const { data: articles } = responseArticles;
  const responseHighlights = highlights.data;
  const { data: highlightsArticles } = responseHighlights;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Article Dashboard</h1>

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
          <h2 className="text-2xl font-semibold mb-4">All Articles</h2>
          <div className="space-y-6">
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
