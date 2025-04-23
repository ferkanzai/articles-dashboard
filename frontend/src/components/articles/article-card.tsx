import { useMutation } from "@tanstack/react-query";
import { Eye, Share } from "lucide-react";
import { useEffect, useState } from "react";
import { TextReveal } from "../text-reveal";
import type { Article } from "@/api/types";
import { api } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ArticleCardProps {
  article: Article;
  highlight?: boolean;
}

export default function ArticleCard({ article }: ArticleCardProps) {
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
      <Card className="max-w-xl w-full rounded-2xl shadow-md border border-gray-200 bg-white/95">
        <CardHeader>
          <div className="text-xl font-extrabold text-gray-900">
            {article.title}
          </div>
          <div className="text-[15px] text-gray-500 font-medium">
            By {article.author.name}{" "}
          </div>
        </CardHeader>
        <CardContent className="px-6 flex flex-col gap-4">
          <div className="text-gray-500 text-[15px] leading-relaxed line-clamp-3">
            {article.content}
          </div>
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-1.5 text-gray-400 text-base font-medium">
              <Eye size={19} className="mr-1" />
              <span>{article.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 text-base font-medium">
              <Share size={19} className="mr-1" />
              <span>{article.shares.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="cursor-pointer w-full font-bold text-lg py-3 rounded-xl border-gray-200 shadow-sm hover:shadow-md bg-white transition-all hover:bg-gray-50"
            disabled={summarizeArticle.isPending}
            onClick={handleSummarize}
            variant="outline"
          >
            <TextReveal
              loading={summarizeArticle.isPending}
              initialText="Summarize"
              loadingText="Generating..."
              loadingBaseTextClassName="text-gray-400"
              loadingRevealTextClassName="text-gray-800"
            />
          </Button>
        </CardFooter>
      </Card>

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
