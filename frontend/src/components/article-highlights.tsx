import ArticleCard from "./article-card";
import type { Article } from "@/api/types";

export default function ArticleHighlights({
  mostViewed,
  mostShared,
}: {
  mostViewed: Article;
  mostShared: Article;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Most Viewed</h3>
        <ArticleCard article={mostViewed} highlight />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">Most Shared</h3>
        <ArticleCard article={mostShared} highlight />
      </div>
    </div>
  );
}
