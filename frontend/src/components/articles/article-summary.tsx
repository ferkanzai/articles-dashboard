import { BookOpenText, Bookmark } from "lucide-react";
import {  cva } from "class-variance-authority";
import type {VariantProps} from "class-variance-authority";
import type { Article } from "@/api/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const gradientColorsVariants = cva("h-1 w-full bg-gradient-to-r", {
  variants: {
    variant: {
      standard: "from-purple-400 via-purple-300 to-yellow-200",
      mostViews: "from-blue-400 via-blue-300 to-green-200",
      mostShared: "from-red-400 via-red-300 to-orange-200",
    },
  },
  defaultVariants: {
    variant: "standard",
  },
});

export default function ArticleSummary({
  article,
  open,
  setOpen,
  setSummary,
  summary,
  variant,
}: {
  article: Article;
  open: boolean;
  setOpen: (openValue: boolean) => void;
  setSummary: (summaryValue: string | null) => void;
  summary: string | null;
  variant?: VariantProps<typeof gradientColorsVariants>["variant"];
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
      <DialogContent
        className="md:max-w-lg rounded-2xl p-0 border-none shadow-xl"
      >
        <div className="flex flex-col rounded-2xl overflow-hidden md:max-w-lg">
          <div className={cn(gradientColorsVariants({ variant }))} />
          <div className="flex flex-row items-center gap-3 pt-7 pb-1 px-7">
            <div className="flex items-center justify-center rounded-full bg-purple-200/70 shadow-sm p-2">
              <Bookmark size={24} className="text-purple-700" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-[1.15rem] font-extrabold text-gray-900 leading-tight">
                {article.title}
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-[15px] font-medium text-gray-500">
                By {article.author.name}
              </DialogDescription>
            </div>
          </div>
          <div className="border-b border-purple-100 mb-0.5 mt-3 mx-7" />
          <div className="py-3 px-7 pb-7">
            <h4 className="font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <BookOpenText size={17} className="text-purple-500 -mt-0.5" />
              Summary
            </h4>
            <p className="text-base text-gray-600 leading-relaxed font-medium bg-white/70 rounded-lg">
              {summary || (
                <span className="italic text-gray-400">
                  No summary available.
                </span>
              )}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
