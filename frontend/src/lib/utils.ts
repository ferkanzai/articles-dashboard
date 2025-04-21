import {  clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type {ClassValue} from 'clsx';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function getQueryParams(opts: {
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
  sortBy?: "views" | "shares";
  authorId?: number;
}) {
  const params = {
    page: opts.page?.toString(),
    limit: opts.limit?.toString(),
    sort: opts.sort,
    sortBy: opts.sortBy,
    authorId: opts.authorId?.toString(),
  };

  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined),
  );
  const filteredStringParams = Object.fromEntries(
    Object.entries(filteredParams).map(([key, value]) => [key, String(value)]),
  );
  if (opts.sortBy === undefined) {
    delete filteredStringParams.sort;
  }

  return filteredStringParams;
}