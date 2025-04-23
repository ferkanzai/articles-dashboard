import { Badge } from "./ui/badge";

export default function FilterBadge({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return value ? (
    <Badge
      variant="secondary"
      className="h-[18.24px] rounded-[3.2px] px-[5.12px] font-mono font-normal text-[10.4px]"
    >
      {label}
    </Badge>
  ) : null;
}
