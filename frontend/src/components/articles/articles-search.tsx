import { useNavigate, useSearch } from "@tanstack/react-router";
import { DeleteIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

export default function ArticlesSearch() {
  const { search } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
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
    navigate({
      search: (old) => ({
        ...old,
        search: undefined,
      }),
      replace: true,
      resetScroll: false,
    });
  };

  useEffect(() => {
    navigate({
      search: (old) => ({
        ...old,
        search: debouncedSearch,
      }),
      replace: true,
      resetScroll: false,
    });
  }, [debouncedSearch]);

  return (
    <div className="w-full md:w-1/2 mx-auto flex items-center gap-2">
      <Input
        placeholder="Search articles..."
        onChange={handleSearch}
        autoFocus
        value={searchValue ?? ""}
      />
      <Button variant="outline" size="icon" className="cursor-pointer" onClick={handleDelete}>
        <DeleteIcon />
      </Button>
    </div>
  );
}
