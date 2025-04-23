import { Eye, Share2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Article } from "@/api/types";
import { api } from "@/api";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

export function SpotlightCard({ type, article }: SpotlightCardProps) {
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
        <div className="flex gap-3 items-center mb-3 mt-6">
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
        <div>
          <div className="text-xl font-bold mb-1 text-gray-900">
            {article.title}
          </div>
          <div className="text-sm text-gray-700 mb-2">
            By {article.author.name}
          </div>
          <div className="text-gray-600 text-[15px] mb-5 line-clamp-3">
            {article.content}
          </div>
        </div>
        <button
          className={cn(
            "w-full py-2 rounded-lg mt-1 font-semibold cursor-pointer",
            "backdrop-blur-lg bg-white/60 hover:bg-white/80 transition",
            "border border-white/30 text-gray-900 shadow-sm",
            "focus:outline-none focus:ring-2 focus:ring-blue-400",
            "group-hover:shadow-lg group-hover:-translate-y-0.5",
          )}
          onClick={handleSummarize}
        >
          {summarizeArticle.isPending ? "Generating..." : "Summarize"}
        </button>
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-30 transition group-hover:animate-pulse",
            type === "mostViewed"
              ? "bg-gradient-to-tr from-sky-400 via-blue-500 to-blue-700"
              : "bg-gradient-to-tr from-fuchsia-400 via-pink-500 to-purple-600",
          )}
        />
      </div>
      <Dialog
        open={open}
        onOpenChange={(openValue) => {
          setOpen(openValue);
          if (!openValue) {
            setSummary(null);
          }
        }}
      >
        <DialogContent className="md:max-w-md">
          <DialogHeader>
            <DialogTitle className="mb-2">{article.title}</DialogTitle>
            <DialogDescription>By {article.author.name}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <h4 className="font-medium mb-2">Summary</h4>
            <p className="text-sm text-muted-foreground">{summary}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SpotlightCard;
