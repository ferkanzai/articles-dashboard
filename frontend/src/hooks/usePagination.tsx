import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import type { ValidRoutes } from "@/types/routes";
import type { PaginatedArticlesResponse } from "@/api/types";
import { api } from "@/api";

export const usePagination = ({ pathname }: { pathname: ValidRoutes }) => {
  const navigate = useNavigate({ from: pathname });
  const { page, limit, sort, sortBy, authorId } = useSearch({ from: pathname });
  const [pageParam, setPageParam] = useState(page ?? 1);
  const [limitParam, setLimitParam] = useState(limit ?? 10);
  const [sortParam, setSortParam] = useState(sort ?? "desc");
  const [sortByParam, setSortByParam] = useState(sortBy);
  const [authorIdParam, setAuthorIdParam] = useState(authorId);

  const params = {
    page: pageParam.toString(),
    limit: limitParam.toString(),
    sort: sortParam,
    sortBy: sortByParam,
    authorId: authorIdParam?.toString(),
  };

  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined),
  );
  const filteredStringParams = Object.fromEntries(
    Object.entries(filteredParams).map(([key, value]) => [key, String(value)]),
  );
  if (sortByParam === undefined) {
    delete filteredStringParams.sort;
  }

  const queryParams = new URLSearchParams(filteredStringParams);

  const { data } = useSuspenseQuery({
    queryKey: ["articles", queryParams],
    queryFn: () =>
      api.get<PaginatedArticlesResponse>(`/articles?${queryParams.toString()}`),
  });

  const responseArticles = data.data;
  const { lastPage } = responseArticles;

  useEffect(() => {
    if (pageParam !== 1 && page !== 1 && pageParam > lastPage) {
      setPageParam(1);
    }

    navigate({
      search: (old) => {
        return {
          ...old,
          page: pageParam,
          limit: limitParam,
          sort: sortByParam ? sortParam : undefined,
          sortBy: sortByParam,
          authorId: authorIdParam,
        };
      },
      replace: true,
    });
  }, [
    pageParam,
    limitParam,
    sortParam,
    sortByParam,
    authorIdParam,
    lastPage,
    navigate,
  ]);

  return {
    lastPage,
    pageParam,
    setPageParam,
    setLimitParam,
    setSortParam,
    setSortByParam,
    setAuthorIdParam,
  };
};
