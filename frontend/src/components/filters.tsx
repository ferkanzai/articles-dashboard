import { useNavigate, useSearch } from "@tanstack/react-router";
import { ChevronsUpDownIcon, FilterIcon } from "lucide-react";
import { Suspense, useState } from "react";
import { AuthorFilter } from "./author-filter";
import { Spinner } from "./spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FilterSidebar() {
  const { limit, sortBy, sort } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });

  const [isOpen, setIsOpen] = useState(false);

  const sortByOptions = ["views", "shares"];
  const sortOptions = ["desc", "asc"];

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border-1 border-blue-600/20 p-2 rounded-md"
    >
      <CollapsibleTrigger className="flex items-center gap-2 w-full cursor-pointer justify-between px-6">
        <span className="flex items-center gap-2">
          <FilterIcon className="w-4 h-4" />
          <span>Filters</span>
        </span>
        <ChevronsUpDownIcon className="w-4 h-4" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="gap-4 flex flex-col md:flex-row justify-between">
              <div className="space-y-2">
                <Label className="font-bold">Articles per page</Label>
                <Select
                  onValueChange={(value) =>
                    navigate({
                      search: (old) => ({
                        ...old,
                        limit: parseInt(value),
                      }),
                      replace: true,
                    })
                  }
                  value={limit ? limit.toString() : "10"}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Articles per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-bold">Filter by Author</Label>
                <Suspense fallback={<Spinner size="small" />}>
                  <AuthorFilter />
                </Suspense>
              </div>

              <div className="space-y-2">
                <Label className="font-bold">Sorting by</Label>
                <RadioGroup
                  value={sortBy ? sortBy : "none"}
                  onValueChange={(value) => {
                    if (value === "none") {
                      navigate({
                        search: { sortBy: undefined, sort: "desc", page: 1 },
                        replace: true,
                      });
                    } else {
                      navigate({
                        search: (old) => ({
                          ...old,
                          page: 1,
                          sortBy: value as "views" | "shares",
                          sort: "desc",
                        }),
                        replace: true,
                      });
                    }
                  }}
                  className="grid grid-cols-3 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="sort-none" />
                    <Label htmlFor="sort-none" className="cursor-pointer">
                      No sorting
                    </Label>
                  </div>

                  {sortByOptions.map((sortByOption) => (
                    <div
                      key={sortByOption}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={sortByOption}
                        id={`sort-${sortByOption}`}
                      />
                      <Label
                        htmlFor={`sort-${sortByOption}`}
                        className="cursor-pointer"
                      >
                        <span>
                          Sort by{" "}
                          <span className="capitalize">{sortByOption}</span>
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label className="font-bold">Sorting direction</Label>
                <RadioGroup
                  value={sort ?? "desc"}
                  onValueChange={(value) => {
                    navigate({
                      search: (old) => ({
                        ...old,
                        page: 1,
                        sort: value as "asc" | "desc",
                      }),
                      replace: true,
                    });
                  }}
                  className="grid grid-cols-2 gap-2"
                >
                  {sortOptions.map((sortOption) => (
                    <div
                      key={sortOption}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={sortOption}
                        id={`sort-${sortOption}`}
                      />
                      <Label
                        htmlFor={`sort-${sortOption}`}
                        className="cursor-pointer"
                      >
                        <span className="capitalize">
                          {sortOption === "asc" ? "ascending" : "descending"}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() => {
                navigate({
                  search: {
                    page: 1,
                    limit: 10,
                    authorId: undefined,
                    sortBy: undefined,
                    sort: undefined,
                  },
                  replace: true,
                });
              }}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
