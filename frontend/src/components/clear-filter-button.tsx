import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import type { ButtonVariant } from "./ui/button";
import { cn } from "@/lib/utils";
import { useUpdateNavigate } from "@/hooks/useUpdateNavigate";

export default function ClearFilterButton({
  children,
  className,
  filtersToClear,
  tooltipContent,
  variant = "secondary",
}: {
  children: React.ReactNode;
  className?: string;
  filtersToClear: Record<string, string | number | undefined>;
  tooltipContent: string;
  variant?: ButtonVariant;
}) {
  const { navigate } = useUpdateNavigate();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size="sm"
            className={cn(className, "cursor-pointer")}
            onClick={() => {
              navigate(filtersToClear);
            }}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
