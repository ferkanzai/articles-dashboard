import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { AuthorsResponse } from "@/api/types";
import { api } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSearchParams } from "@/hooks/useSearchParams";

export default function FilterSidebar() {
  const navigate = useNavigate({ from: "/" });
  const {
    authorIdParam,
    setAuthorIdParam,
    setSortByParam,
    setSortParam,
    sortByParam,
    sortParam,
    limitParam,
    setLimitParam,
  } = useSearchParams({
    pathname: "/",
  });

  const { data: authorsResponse } = useSuspenseQuery({
    queryKey: ["authors"],
    queryFn: () => api.get<AuthorsResponse>("/authors"),
  });

  const authorsData = authorsResponse.data;
  const { data: authors } = authorsData;

  const sortBy = ["views", "shares"];
  const sort = ["desc", "asc"];

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-0">
        <div className="md:grid md:grid-cols-2 md:grid-rows-2 gap-4 space-y-4 md:space-y-0">
          <div className="space-y-2">
            <Label className="font-bold">Articles per page</Label>
            <Select
              onValueChange={(value) => setLimitParam(parseInt(value))}
              value={limitParam ? limitParam.toString() : "10"}
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
            <RadioGroup
              value={authorIdParam ? authorIdParam.toString() : "0"}
              onValueChange={(value) => {
                if (value === "0") {
                  navigate({
                    search: { authorId: undefined, page: 1 },
                    replace: true,
                  });
                } else {
                  setAuthorIdParam(parseInt(value));
                }
              }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="author-all" />
                <Label htmlFor="author-all" className="cursor-pointer">
                  All Authors
                </Label>
              </div>

              {authors.map((author) => (
                <div key={author.id} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={author.id.toString()}
                    id={`author-${author.id}`}
                  />
                  <Label
                    htmlFor={`author-${author.id}`}
                    className="cursor-pointer"
                  >
                    {author.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="font-bold">Sorting by</Label>
            <RadioGroup
              value={sortByParam ? sortByParam : "none"}
              onValueChange={(value) => {
                if (value === "none") {
                  navigate({
                    search: { sortBy: undefined, sort: "desc", page: 1 },
                    replace: true,
                  });
                  setSortByParam(undefined);
                } else {
                  setSortByParam(value as "views" | "shares");
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

              {sortBy.map((sortByValue) => (
                <div key={sortByValue} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={sortByValue}
                    id={`sort-${sortByValue}`}
                  />
                  <Label
                    htmlFor={`sort-${sortByValue}`}
                    className="cursor-pointer"
                  >
                    <span>
                      Sort by <span className="capitalize">{sortByValue}</span>
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="font-bold">Sorting direction</Label>
            <RadioGroup
              value={sortParam}
              onValueChange={(value) => {
                setSortParam(value as "asc" | "desc");
              }}
              className="grid grid-cols-2 gap-2"
            >
              {sort.map((sortValue) => (
                <div key={sortValue} className="flex items-center space-x-2">
                  <RadioGroupItem value={sortValue} id={`sort-${sortValue}`} />
                  <Label
                    htmlFor={`sort-${sortValue}`}
                    className="cursor-pointer"
                  >
                    <span className="capitalize">
                      {sortValue === "asc" ? "ascending" : "descending"}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            navigate({
              search: {
                authorId: undefined,
                sortBy: undefined,
                sort: "desc",
                page: 1,
                limit: 10,
              },
              replace: true,
            });
            setSortByParam(undefined);
            setSortParam("desc");
            setAuthorIdParam(undefined);
            setLimitParam(10);
          }}
        >
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
}
