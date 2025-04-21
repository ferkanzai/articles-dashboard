import { ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import type { ValidRoutes } from "@/types/routes";
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
import { cn } from "@/lib/utils";

export default function ArticlesPagination({
  pathname,
}: {
  pathname: ValidRoutes;
}) {
  const { pageParam, setPageParam, lastPage, hasNextPage } = usePagination({
    pathname,
  });

  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);
  const pagesToShow =
    pageParam > 3 && pageParam < lastPage
      ? pages.slice(pageParam - 2, pageParam + 1)
      : pageParam === lastPage
        ? pages.slice(lastPage - 3)
        : pages.slice(0, 3);

  console.log({ pageParam, lastPage });

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            className={cn(
              "select-none",
              pageParam > 1 ? "cursor-pointer" : "cursor-not-allowed",
            )}
            isActive={pageParam > 1}
            onClick={() => {
              if (pageParam > 1) {
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
              pageParam > 1 ? "cursor-pointer" : "cursor-not-allowed",
            )}
            isActive={pageParam > 1}
            onClick={() => {
              if (pageParam > 1) {
                setPageParam(pageParam - 1);
              }
            }}
          />
        </PaginationItem>
        {pageParam > 3 && (
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
        {pageParam < lastPage - 1 && pageParam >= 3 && lastPage > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            className={cn(
              "select-none",
              hasNextPage && pageParam < lastPage
                ? "cursor-pointer"
                : "cursor-not-allowed",
            )}
            isActive={hasNextPage && pageParam < lastPage}
            onClick={() => {
              if (hasNextPage && pageParam < lastPage) {
                setPageParam(pageParam + 1);
              }
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            className={cn(
              "select-none",
              hasNextPage && pageParam < lastPage
                ? "cursor-pointer"
                : "cursor-not-allowed",
            )}
            isActive={pageParam !== lastPage}
            onClick={() => {
              if (pageParam !== lastPage) {
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
