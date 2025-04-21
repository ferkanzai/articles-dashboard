import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { articlesQueryOptions } from "@/api";
import { getQueryParams } from "@/lib/utils";

export const usePagination = ({ pathname }: { pathname: "/" }) => {
  const navigate = useNavigate({ from: pathname });
  const { page, limit, sort, sortBy, authorId } = useSearch({ from: pathname });
  const [pageParam, setPageParam] = useState(page ?? 1);
  const [limitParam, setLimitParam] = useState(limit ?? 10);
  const [sortParam, setSortParam] = useState(sort ?? "desc");
  const [sortByParam, setSortByParam] = useState(sortBy);
  const [authorIdParam, setAuthorIdParam] = useState(authorId);

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
      resetScroll: false,
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
