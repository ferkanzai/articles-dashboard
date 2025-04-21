import { queryOptions } from "@tanstack/react-query";
import axios from "axios";
import type { PaginatedArticlesResponse } from "./types";

const BASE_URL = import.meta.env.VITE_API_URL;

const fetcher = axios.create({
  baseURL: BASE_URL,
});

export const api = {
  get: fetcher.get,
  post: fetcher.post,
  put: fetcher.put,
  delete: fetcher.delete,
};

export const articlesQueryOptions = (opts: {
  authorId?: string;
  page?: string;
  limit?: string;
  sort?: "asc" | "desc";
  sortBy?: "views" | "shares";
}) =>
  queryOptions({
    queryKey: ["articles", opts],
    queryFn: () => {
      const queryParams = new URLSearchParams(opts);
      return api.get<PaginatedArticlesResponse>(`/articles?${queryParams.toString()}`);
    },
  });