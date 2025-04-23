import { useSearch } from "@tanstack/react-router";
import { ListFilterIcon, XIcon } from "lucide-react";
import { Suspense, useState } from "react";
import SelectFilter from "./select-filter";
import { AuthorFilter } from "@/components/author-filter";
import FilterBadge from "@/components/badge-filter";
import ClearFilterButton from "@/components/clear-filter-button";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUpdateNavigate } from "@/hooks/useUpdateNavigate";

export default function Filters() {
  const { sortBy, sort, authorId, limit, page } = useSearch({ from: "/" });
  const { navigate } = useUpdateNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const sortByOptions: Array<"views" | "shares"> = ["views", "shares"];
  const sortOptions: Array<"asc" | "desc"> = ["desc", "asc"];

  return (
    <div className="flex gap-2 sm:items-center overflow-clip mx-2 flex-col sm:flex-row">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger className="cursor-pointer" asChild>
          <Button variant="outline" className="justify-start">
            <ListFilterIcon className="w-4 h-4" />
            <span>Filters</span>
            <div className="flex gap-1 items-center">
              <FilterBadge label={`limit: ${limit}`} value={limit} />
              <FilterBadge label={`authorId: ${authorId}`} value={authorId} />
              <FilterBadge label={`${sortBy}`} value={sortBy} />
              <FilterBadge label={`${sort}`} value={sort} />
              <FilterBadge label={`page: ${page}`} value={page} />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="flex flex-col gap-3.5 p-4 sm:min-w-[380px]"
        >
          <div className="flex gap-2 flex-1">
            <SelectFilter
              clearFilter={{
                page: 1,
                sortBy: undefined,
                sort: undefined,
              }}
              label="Sort by"
              onValueChange={(value) => {
                navigate({
                  page: 1,
                  sortBy: value as "views" | "shares",
                  sort: sort ?? "desc",
                });
              }}
              selectOptions={sortByOptions}
              tooltipContent="Reset sort by"
              value={sortBy}
            />
            <SelectFilter
              clearFilter={{
                page: 1,
                sort: sortBy ? "desc" : undefined,
              }}
              disabled={!sortBy}
              label="Sort direction"
              onValueChange={(value) => {
                navigate({
                  page: 1,
                  sort: value as "asc" | "desc",
                });
              }}
              selectOptions={sortOptions}
              tooltipContent="Reset sort direction"
              value={sort || ""}
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <Label>Filter by Author</Label>
            <Suspense fallback={<Spinner size="small" />}>
              <AuthorFilter />
            </Suspense>
          </div>
        </PopoverContent>
      </Popover>
      {sortBy || sort || authorId || page !== 1 || limit !== 10 ? (
        <ClearFilterButton
          filtersToClear={{
            page: 1,
            limit: 10,
            authorId: undefined,
            sortBy: undefined,
            sort: undefined,
          }}
          tooltipContent="Reset all filters"
          variant="outline"
        >
          <XIcon className="w-4 h-4" />
        </ClearFilterButton>
      ) : null}
    </div>
  );
}
