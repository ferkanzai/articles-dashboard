import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { useEffect } from "react";

import { useSearchParams } from "./useSearchParams";
import { articlesQueryOptions } from "@/api";
import { getQueryParams } from "@/lib/utils";

export const usePagination = ({ pathname }: { pathname: "/" }) => {
  const { page } = useSearch({ from: pathname });
  const {
    pageParam,
    limitParam,
    sortParam,
    sortByParam,
    authorIdParam,
    setPageParam,
  } = useSearchParams({ pathname });

  const params = {
    page: pageParam,
    limit: limitParam,
    sort: sortParam,
    sortBy: sortByParam,
    authorId: authorIdParam,
  };

  const queryParams = getQueryParams(params);

  const { data } = useSuspenseQuery(articlesQueryOptions(queryParams));

  const responseArticles = data.data;
  const { lastPage } = responseArticles;

  useEffect(() => {
    if (pageParam !== 1 && page !== 1 && pageParam > lastPage) {
      setPageParam(1);
    }
  }, [pageParam, lastPage]);

  return {
    lastPage
  }
};
