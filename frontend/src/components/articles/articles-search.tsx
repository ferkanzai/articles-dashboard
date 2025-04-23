import { useSearch } from "@tanstack/react-router";
import { DeleteIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useUpdateNavigate } from "@/hooks/useUpdateNavigate";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ArticlesSearch() {
  const { search, limit } = useSearch({ from: "/" });
  const { navigate } = useUpdateNavigate();
  const [searchValue, setSearchValue] = useState(search);
  const debouncedSearch = useDebounce(searchValue, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setSearchValue(undefined);
    } else {
      setSearchValue(e.target.value);
    }
  };

  const handleDelete = () => {
    setSearchValue(undefined);
    navigate({ search: undefined });
  };

  useEffect(() => {
    navigate({ search: debouncedSearch });
  }, [debouncedSearch]);

  return (
    <div className="w-full md:w-1/2 mx-auto flex md:items-baseline-last gap-2 flex-col-reverse md:flex-row justify-between">
      <div className="w-full flex md:flex-col gap-2 flex-0 min-w-32 items-center sm:justify-center">
        <Label className="font-bold">Articles per page</Label>
        <Select
          onValueChange={(value) => navigate({ limit: parseInt(value) })}
          value={limit ? limit.toString() : "10"}
        >
          <SelectTrigger className="md:w-full">
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

      <div className="flex items-center gap-2 flex-1">
        <Input
          placeholder="Search articles..."
          onChange={handleSearch}
          autoFocus
          value={searchValue ?? ""}
        />
        <Button
          variant="outline"
          size="icon"
          className="disabled:cursor-not-allowed cursor-pointer"
          onClick={handleDelete}
          disabled={!searchValue}
        >
          <DeleteIcon />
        </Button>
      </div>
    </div>
  );
}
