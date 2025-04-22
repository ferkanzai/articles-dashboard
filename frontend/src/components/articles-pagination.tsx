import { ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/usePagination";
import { useSearchParams } from "@/hooks/useSearchParams";
import { cn } from "@/lib/utils";

export default function ArticlesPagination({ pathname }: { pathname: "/" }) {
  const { lastPage } = usePagination({ pathname });
  const { pageParam, setPageParam } = useSearchParams({ pathname });

  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);
  const pagesToShow =
    pageParam > 3 && pageParam < lastPage
      ? pages.slice(pageParam - 3, pageParam + 1)
      : pageParam === lastPage && lastPage > 4
        ? pages.slice(lastPage - 4)
        : pages.slice(0, 4);

  const isFirstPage = pageParam === 1;
  const isLastPage = pageParam === lastPage;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            className={cn(
              "select-none",
              !isFirstPage ? "cursor-pointer" : "cursor-not-allowed",
            )}
            isActive={!isFirstPage}
            onClick={() => {
              if (!isFirstPage) {
                setPageParam(1);
              }
            }}
            size="default"
          >
            <ChevronsLeftIcon /> <span className="hidden sm:block">First</span>
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            className={cn(
              "select-none",
              !isFirstPage ? "cursor-pointer" : "cursor-not-allowed",
            )}
            isActive={!isFirstPage}
            onClick={() => {
              if (!isFirstPage) {
                setPageParam(pageParam - 1);
              }
            }}
          />
        </PaginationItem>
        {!isFirstPage && pageParam > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {pagesToShow.map((pageToShow) => (
          <PaginationItem key={pageToShow}>
            <PaginationLink
              className={cn(
                "cursor-pointer select-none",
                pageParam === pageToShow
                  ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                  : "",
              )}
              onClick={() => setPageParam(pageToShow)}
            >
              {pageToShow}
            </PaginationLink>
          </PaginationItem>
        ))}
        {!isLastPage && lastPage > 4 && lastPage - pageParam >= 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            className={cn(
              "select-none",
              !isLastPage ? "cursor-pointer" : "cursor-not-allowed",
            )}
            isActive={!isLastPage}
            onClick={() => {
              if (!isLastPage) {
                setPageParam(pageParam + 1);
              }
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            className={cn(
              "select-none",
              !isLastPage ? "cursor-pointer" : "cursor-not-allowed",
            )}
            isActive={!isLastPage}
            onClick={() => {
              if (!isLastPage) {
                setPageParam(lastPage);
              }
            }}
            size="default"
          >
            <span className="hidden sm:block">Last</span> <ChevronsRightIcon />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
