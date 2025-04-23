import { useSearch } from "@tanstack/react-router";
import {
  ListFilterIcon,
  XIcon
} from "lucide-react";
import { Suspense, useState } from "react";
import { AuthorFilter } from "./author-filter";
import { Spinner } from "./spinner";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useUpdateNavigate } from "@/hooks/useUpdateNavigate";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Filters() {
  const { sortBy, sort, authorId } = useSearch({ from: "/" });
  const { navigate } = useUpdateNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const sortByOptions = ["views", "shares"];
  const sortOptions = ["desc", "asc"];

  return (
    <div className="flex gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger className="cursor-pointer" asChild>
          <Button variant="outline">
            <ListFilterIcon className="w-4 h-4" />
            <span>Filters</span>
            {authorId ? (
              <Badge
                variant="secondary"
                className="h-[18.24px] rounded-[3.2px] px-[5.12px] font-mono font-normal text-[10.4px]"
              >
                authorId: {authorId}
              </Badge>
            ) : null}
            {sortBy ? (
              <Badge
                variant="secondary"
                className="h-[18.24px] rounded-[3.2px] px-[5.12px] font-mono font-normal text-[10.4px]"
              >
                {sortBy}
              </Badge>
            ) : null}
            {sort ? (
              <Badge
                variant="secondary"
                className="h-[18.24px] rounded-[3.2px] px-[5.12px] font-mono font-normal text-[10.4px]"
              >
                {sort}
              </Badge>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="flex flex-col gap-3.5 p-4 sm:min-w-[380px]"
        >
          <div className="flex gap-2 flex-1">
            <Select
              onValueChange={(value) => {
                navigate({
                  page: 1,
                  sortBy: value as "views" | "shares",
                  sort: sort ?? "desc",
                });
              }}
              value={sortBy || ""}
            >
              <div className="flex flex-col gap-2 flex-1">
                <Label>Sort by</Label>
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue
                    placeholder="Sort by"
                  />
                </SelectTrigger>
              </div>
              <SelectContent>
                {sortByOptions.map((sortByOption) => (
                  <SelectItem
                    key={sortByOption}
                    value={sortByOption}
                  >
                    <span className="capitalize">{sortByOption}</span>
                  </SelectItem>
                ))}
                <SelectSeparator />
                <Button
                  className="w-full px-2"
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({
                      page: 1,
                      sortBy: undefined,
                      sort: undefined,
                      authorId: undefined,
                    });
                  }}
                >
                  Clear
                </Button>
              </SelectContent>
            </Select>
            <Select
              disabled={!sortBy}
              onValueChange={(value) => {
                navigate({
                  page: 1,
                  sort: value as "asc" | "desc",
                });
              }}
              value={sort || ""}
            >
              <div className="flex flex-col gap-2 flex-1">
                <Label>Sort direction</Label>
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Sort direction" />
                </SelectTrigger>
              </div>
              <SelectContent>
                {sortOptions.map((sortOption) => (
                  <SelectItem
                    key={sortOption}
                    value={sortOption}
                    className="capitalize"
                  >
                    {sortOption === "asc" ? "Ascending" : "Descending"}
                  </SelectItem>
                ))}
                <Button
                  className="w-full px-2"
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({
                      page: 1,
                      sort: sortBy ? "desc" : undefined,
                    });
                  }}
                >
                  Clear
                </Button>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <Label>Filter by Author</Label>
            <Suspense fallback={<Spinner size="small" />}>
              <AuthorFilter />
            </Suspense>
          </div>
        </PopoverContent>
      </Popover>
      {sortBy || sort || authorId ? (
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            navigate({
              page: 1,
              sortBy: undefined,
              sort: undefined,
              authorId: undefined,
            });
          }}
        >
          <XIcon className="w-4 h-4" />
        </Button>
      ) : null}
    </div>
  );
}
