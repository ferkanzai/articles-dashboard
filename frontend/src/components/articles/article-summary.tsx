import type { Article } from "@/api/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ArticleSummary({
  article,
  open,
  setOpen,
  setSummary,
  summary,
}: {
  article: Article;
  open: boolean;
  setOpen: (openValue: boolean) => void;
  setSummary: (summaryValue: string | null) => void;
  summary: string | null;
}) {
  return (
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
          <DialogTitle>{article.title}</DialogTitle>
          <DialogDescription>By {article.author.name}</DialogDescription>
        </DialogHeader>
        <div>
          <h4 className="font-medium">Summary</h4>
          <p className="text-sm text-muted-foreground">{summary}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
