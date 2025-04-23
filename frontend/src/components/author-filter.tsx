import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import type { AuthorsResponse } from "@/api/types";
import { api } from "@/api";
import { Combobox } from "@/components/ui/combobox";

export function AuthorFilter() {
  const navigate = useNavigate({ from: "/" });
  const { authorId } = useSearch({ from: "/" });
  const { data: authorsResponse } = useSuspenseQuery({
    queryKey: ["authors"],
    queryFn: () => api.get<AuthorsResponse>("/authors"),
  });

  const authorsData = authorsResponse.data;
  const { data: authors } = authorsData;

  const authorsValues = authors.map((author) => ({
    value: author.id.toString(),
    label: author.name,
  }));

  return (
    <Combobox
      values={authorsValues}
      value={authorId?.toString() ?? ""}
      setValue={(value) => {
        navigate({
          search: {
            authorId: value ? parseInt(value) : undefined,
          },
          replace: true,
        });
      }}
      placeholder="Select author"
      emptyMessage="No author found"
    />
  );
}
