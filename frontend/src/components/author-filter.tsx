import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import type { AuthorsResponse } from "@/api/types";
import { api } from "@/api";
import { Combobox } from "@/components/ui/combobox";
import { useUpdateNavigate } from "@/hooks/useUpdateNavigate";

export function AuthorFilter() {
  const { navigate } = useUpdateNavigate();
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
        navigate({ authorId: value ? parseInt(value) : undefined });
      }}
      placeholder="Select author"
      emptyMessage="No author found"
    />
  );
}
