import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type SearchParams = {
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
  sortBy?: "views" | "shares";
  authorId?: number;
  [key: string]: any;
};

export const useSearchParams = ({ pathname }: { pathname: "/" }) => {
  const navigate = useNavigate({ from: pathname });
  const { page, limit, sort, sortBy, authorId } = useSearch({ from: pathname });
  const [pageParam, setPageParam] = useState(page ?? 1);
  const [limitParam, setLimitParam] = useState(limit ?? 10);
  const [sortParam, setSortParam] = useState(sort ?? "desc");
  const [sortByParam, setSortByParam] = useState(sortBy);
  const [authorIdParam, setAuthorIdParam] = useState(authorId);

  useEffect(() => {
    if (page !== undefined && page !== pageParam) {
      setPageParam(page);
    }
    if (limit !== undefined && limit !== limitParam) {
      setLimitParam(limit);
    }
    if (sort !== undefined && sort !== sortParam) {
      setSortParam(sort);
    }
    if (sortBy !== sortByParam) {
      setSortByParam(sortBy);
    }
    if (authorId !== authorIdParam) {
      setAuthorIdParam(authorId);
    }
  }, [page, limit, sort, sortBy, authorId]);

  useEffect(() => {
    navigate({
      search: (old) => {
        const newSearch: SearchParams = {
          ...old,
          page: pageParam,
          limit: limitParam,
          sort: sortByParam ? sortParam : undefined,
          sortBy: sortByParam,
          authorId: authorIdParam,
        };

        Object.keys(newSearch).forEach((key) => {
          if (newSearch[key] === undefined) {
            delete newSearch[key];
          }
        });

        return newSearch;
      },
      replace: true,
      resetScroll: false,
    });
  }, [pageParam, limitParam, sortParam, sortByParam, authorIdParam]);

  return {
    authorIdParam,
    pageParam,
    limitParam,
    sortParam,
    sortByParam,
    setPageParam,
    setLimitParam,
    setSortParam,
    setSortByParam,
    setAuthorIdParam,
  };
};
