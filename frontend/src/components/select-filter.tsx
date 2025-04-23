import ClearFilterButton from "@/components/clear-filter-button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const selectOptionsLabels = {
  views: "views",
  shares: "shares",
  asc: "ascending",
  desc: "descending",
};

export default function SelectFilter({
  clearFilter,
  disabled = false,
  label,
  onValueChange,
  selectOptions,
  tooltipContent,
  value,
}: {
  clearFilter: Record<string, string | number | undefined>;
  disabled?: boolean;
  label: string;
  onValueChange: (valueToChange: string) => void;
  selectOptions: Array<keyof typeof selectOptionsLabels>;
  tooltipContent: string;
  value?: string;
}) {
  return (
    <Select
      onValueChange={onValueChange}
      value={value || ""}
      disabled={disabled}
      aria-label={label}
    >
      <div className="flex flex-col gap-2 flex-1">
        <Label aria-label={label}>{label}</Label>
        <SelectTrigger data-testid="select-trigger" className="w-full max-w-48">
          <SelectValue placeholder={label} />
        </SelectTrigger>
      </div>
      <SelectContent>
        {selectOptions.map((selectOption) => (
          <SelectItem
            key={selectOption}
            value={selectOption}
            aria-label={selectOption}
            data-testid={`select-option-${selectOption}`}
          >
            <span className="capitalize">
              {selectOptionsLabels[selectOption]}
            </span>
          </SelectItem>
        ))}
        <SelectSeparator />
        <ClearFilterButton
          className="w-full px-2"
          filtersToClear={clearFilter}
          tooltipContent={tooltipContent}
        >
          Clear
        </ClearFilterButton>
      </SelectContent>
    </Select>
  );
}
