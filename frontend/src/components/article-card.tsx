import { useState } from "react";
import { Eye, Share2 } from "lucide-react";
import type { Article } from "@/api/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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

export default function ArticleCard({
  article,
  highlight = false,
}: ArticleCardProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSummarize = async () => {
    console.log("Summarizing article", article.id);
  };

  return (
    <>
      <Card className={highlight ? "border-primary" : ""}>
        <CardHeader>
          <CardTitle>{article.title}</CardTitle>
          <CardDescription>By {article.author.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {article.content}
          </p>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{article.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              <span>{article.shares.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSummarize}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            {loading ? "Generating..." : "Summarize"}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
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
