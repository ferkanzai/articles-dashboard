import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ArticlesPagination from "@/components/articles/articles-pagination";

const mockNavigate = vi.fn();
vi.mock("@/hooks/useUpdateNavigate", () => ({
  useUpdateNavigate: () => ({ navigate: mockNavigate }),
}));

const mockUseSearch = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useSearch: (opts: { from: string }) => mockUseSearch(opts),
}));

const renderComponent = (page: number | undefined, lastPage: number) => {
  mockUseSearch.mockReturnValue({ page });
  render(<ArticlesPagination pathname="/" lastPage={lastPage} />);
};

describe("ArticlesPagination", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseSearch.mockClear();
  });

  it("renders correctly on the first page with few pages", () => {
    renderComponent(1, 3);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    const firstLink = screen.getByText("First").closest("a");
    const prevLink = screen.getByLabelText("Go to previous page");
    expect(firstLink).toHaveClass("cursor-not-allowed");
    expect(prevLink).toHaveClass("cursor-not-allowed");

    const lastLink = screen.getByText("Last").closest("a");
    const nextLink = screen.getByLabelText("Go to next page");
    expect(lastLink).toHaveClass("cursor-pointer");
    expect(nextLink).toHaveClass("cursor-pointer");

    expect(screen.getByText("1")).toHaveClass("bg-blue-500");
  });

  it("renders correctly on the last page with few pages", () => {
    renderComponent(3, 3);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    const firstLink = screen.getByText("First").closest("a");
    const prevLink = screen.getByLabelText("Go to previous page");
    expect(firstLink).toHaveClass("cursor-pointer");
    expect(prevLink).toHaveClass("cursor-pointer");

    const lastLink = screen.getByText("Last").closest("a");
    const nextLink = screen.getByLabelText("Go to next page");
    expect(lastLink).toHaveClass("cursor-not-allowed");
    expect(nextLink).toHaveClass("cursor-not-allowed");

    expect(screen.getByText("3")).toHaveClass("bg-blue-500");
  });

  it("renders correctly on a middle page with many pages (shows ellipsis)", () => {
    renderComponent(5, 10);

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();

    expect(screen.queryByText("1")).not.toBeInTheDocument();
    expect(screen.queryByText("2")).not.toBeInTheDocument();
    expect(screen.queryByText("10")).not.toBeInTheDocument();

    // Get the ellipsis by screen reader only text
    expect(screen.getAllByText("More pages")).toHaveLength(2);

    expect(screen.getByText("5")).toHaveClass("bg-blue-500");

    const firstLink = screen.getByText("First").closest("a");
    const prevLink = screen.getByLabelText("Go to previous page");
    const lastLink = screen.getByText("Last").closest("a");
    const nextLink = screen.getByLabelText("Go to next page");
    expect(firstLink).toHaveClass("cursor-pointer");
    expect(prevLink).toHaveClass("cursor-pointer");
    expect(lastLink).toHaveClass("cursor-pointer");
    expect(nextLink).toHaveClass("cursor-pointer");
  });

  it("renders correctly on the first page with many pages", () => {
    renderComponent(1, 10);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.queryByText("5")).not.toBeInTheDocument();

    expect(screen.getAllByText("More pages")).toHaveLength(1);

    const firstLink = screen.getByText("First").closest("a");
    const prevLink = screen.getByLabelText("Go to previous page");
    expect(firstLink).toHaveClass("cursor-not-allowed");
    expect(prevLink).toHaveClass("cursor-not-allowed");

    expect(screen.getByText("1")).toHaveClass("bg-blue-500");
  });

  it("renders correctly on the last page with many pages", () => {
    renderComponent(10, 10);

    expect(screen.queryByText("6")).not.toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();

    expect(screen.getAllByText("More pages")).toHaveLength(1);

    const lastLink = screen.getByText("Last").closest("a");
    const nextLink = screen.getByLabelText("Go to next page");
    expect(lastLink).toHaveClass("cursor-not-allowed");
    expect(nextLink).toHaveClass("cursor-not-allowed");

    expect(screen.getByText("10")).toHaveClass("bg-blue-500");
  });

  it("calls navigate with correct page number when clicking a page link", () => {
    renderComponent(2, 5);
    const pageLink3 = screen.getByText("3");
    fireEvent.click(pageLink3);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith({ page: 3 });
  });

  it("calls navigate with correct page number when clicking Next", () => {
    renderComponent(2, 5);
    const nextLink = screen.getByLabelText("Go to next page");
    fireEvent.click(nextLink);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith({ page: 3 });
  });

  it("calls navigate with correct page number when clicking Previous", () => {
    renderComponent(4, 5);
    const prevLink = screen.getByLabelText("Go to previous page");
    fireEvent.click(prevLink);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith({ page: 3 });
  });

  it("calls navigate with correct page number when clicking First", () => {
    renderComponent(4, 5);
    const firstLink = screen.getByText("First").closest("a") as HTMLElement;
    fireEvent.click(firstLink);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith({ page: 1 });
  });

  it("calls navigate with correct page number when clicking Last", () => {
    renderComponent(2, 5);
    const lastLink = screen.getByText("Last").closest("a") as HTMLElement;
    fireEvent.click(lastLink);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith({ page: 5 });
  });

  it("does not call navigate when clicking First on the first page", () => {
    renderComponent(1, 5);
    const firstLink = screen.getByText("First").closest("a") as HTMLElement;
    fireEvent.click(firstLink);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("does not call navigate when clicking Previous on the first page", () => {
    renderComponent(1, 5);
    const prevLink = screen.getByLabelText("Go to previous page");
    fireEvent.click(prevLink);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("does not call navigate when clicking Last on the last page", () => {
    renderComponent(5, 5);
    const lastLink = screen.getByText("Last").closest("a") as HTMLElement;
    fireEvent.click(lastLink);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("does not call navigate when clicking Next on the last page", () => {
    renderComponent(5, 5);
    const nextLink = screen.getByLabelText("Go to next page");
    fireEvent.click(nextLink);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("handles undefined page parameter, defaulting to page 1", () => {
    renderComponent(undefined, 5);

    expect(screen.getByText("1")).toHaveClass("bg-blue-500");

    const firstLink = screen.getByText("First").closest("a");
    const prevLink = screen.getByLabelText("Go to previous page");
    expect(firstLink).toHaveClass("cursor-not-allowed");
    expect(prevLink).toHaveClass("cursor-not-allowed");
  });
});
