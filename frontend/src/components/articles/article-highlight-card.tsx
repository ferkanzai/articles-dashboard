import { useMutation } from "@tanstack/react-query";
import { Eye, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import ArticleSummary from "./article-summary";
import type { Article } from "@/api/types";
import { api } from "@/api";
import { TextReveal } from "@/components/text-reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SpotlightType = "mostViewed" | "mostShared";

interface SpotlightCardProps {
  type: SpotlightType;
  article: Article;
}

const typeConfig = {
  mostViewed: {
    label: "Most Viewed",
    gradient: "bg-gradient-to-tr from-sky-400 via-blue-500 to-blue-700",
    icon: Eye,
    iconBg: "bg-sky-200",
    glow: "shadow-[0_4px_32px_0_rgba(14,165,233,0.15)]",
    ribbon: "from-sky-400 to-sky-600",
    metricColor: "text-sky-600",
    iconColor: "text-sky-500",
  },
  mostShared: {
    label: "Most Shared",
    gradient: "bg-gradient-to-tr from-fuchsia-400 via-pink-500 to-purple-600",
    icon: Share2,
    iconBg: "bg-fuchsia-200",
    glow: "shadow-[0_4px_32px_0_rgba(236,72,153,0.15)]",
    ribbon: "from-fuchsia-400 to-pink-600",
    metricColor: "text-fuchsia-600",
    iconColor: "text-fuchsia-500",
  },
};

export function ArticleHighlightCard({ type, article }: SpotlightCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  const [summary, setSummary] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const summarizeArticle = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await api.post<{
        data: { summary: string };
        success: boolean;
      }>(`/articles/${id}/summarize`);
      return response.data;
    },
    onSuccess: (data) => {
      setSummary(data.data.summary);
    },
  });

  const handleSummarize = () => {
    summarizeArticle.mutate({ id: article.id });
  };

  useEffect(() => {
    if (summary) {
      setOpen(true);
    }
  }, [summary]);

  return (
    <>
      <div
        className={cn(
          "relative md:max-w-md xl:max-w-xl rounded-2xl p-6 overflow-hidden animate-fade-in min-h-[270px]",
          "backdrop-blur-xl bg-white/80 border border-white/30",
          config.glow,
          "transition-transform duration-200 hover:scale-105 group",
        )}
      >
        <div
          className={cn(
            "absolute top-0 left-0 px-5 py-1 text-sm font-bold text-white rounded-br-2xl z-20 animate-slide-in-right",
            "bg-gradient-to-r",
            config.ribbon,
            "shadow-md",
          )}
        >
          {config.label}
        </div>
        <div className="absolute top-4 right-4 md:top-6 md:right-6">
          <div className="flex gap-3 items-center">
            <span
              className={cn(
                "inline-flex items-center justify-center rounded-full p-2",
                config.iconBg,
                "shadow-md",
                "animate-scale-in",
              )}
            >
              <Icon size={26} className={config.iconColor} />
            </span>
            <span
              className={cn(
                "font-bold text-2xl tracking-tight drop-shadow-sm",
                config.metricColor,
                "animate-fade-in",
              )}
            >
              {type === "mostViewed" ? article.views : article.shares}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <div className="mt-12 flex flex-col gap-2">
            <div className="text-xl font-bold text-gray-900">
              {article.title}
            </div>
            <div className="text-sm text-gray-700">
              By {article.author.name}
            </div>
            <div className="text-gray-600 text-[15px] line-clamp-3">
              {article.content}
            </div>
          </div>
          <Button
            className={cn(
              "w-90 py-2 rounded-lg font-semibold cursor-pointer",
              "backdrop-blur-lg bg-white/60 hover:bg-white/80 transition",
              "border shadow-sm text-gray-900",
              type === "mostViewed" ? "border-sky-400" : "border-fuchsia-400",
              "focus:outline-none focus:ring-2 focus:ring-blue-400",
              "group-hover:shadow-lg group-hover:-translate-y-0.5",
            )}
            onClick={handleSummarize}
          >
            <TextReveal
              loading={summarizeArticle.isPending}
              initialText="Summarize"
              loadingText="Generating..."
              textClassName={cn(
                type === "mostViewed" ? "text-sky-600" : "text-fuchsia-600",
              )}
              loadingBaseTextClassName={cn(
                type === "mostViewed" ? "text-sky-400" : "text-fuchsia-400",
              )}
              loadingRevealTextClassName={cn(
                type === "mostViewed" ? "text-sky-800" : "text-fuchsia-800",
              )}
            />
          </Button>
        </div>
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-30 transition group-hover:animate-pulse",
            type === "mostViewed"
              ? "bg-gradient-to-tr from-sky-400 via-blue-500 to-blue-700"
              : "bg-gradient-to-tr from-fuchsia-400 via-pink-500 to-purple-600",
          )}
        />
      </div>
      <ArticleSummary
        article={article}
        open={open}
        setOpen={setOpen}
        setSummary={setSummary}
        summary={summary}
        variant={type === "mostViewed" ? "mostViews" : "mostShared"}
      />
    </>
  );
}

export default ArticleHighlightCard;
