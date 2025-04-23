import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import SelectFilter from "../src/components/select-filter";

class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;

  constructor(type: string, props: PointerEventInit) {
    super(type, props);
    this.button = props.button || 0;
    this.ctrlKey = props.ctrlKey || false;
    this.pointerType = props.pointerType || "mouse";
  }
}
window.PointerEvent = MockPointerEvent as any;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();

vi.mock("@tanstack/react-router", () => {
  const actual = vi.importActual("@tanstack/react-router");
  const mockNavigate = vi.fn();
  const mockSearch = {};

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearch: () => mockSearch,
    useRouterState: vi.fn(() => ({
      location: {
        search: mockSearch,
        pathname: "/",
      },
    })),
    Link: (props: any) => <a {...props}>{props.children}</a>,
  };
});

type SelectOptionLabelKey = "views" | "shares" | "asc" | "desc";

describe("SelectFilter", () => {
  const mockOnValueChange = vi.fn();
  const mockClearFilter = { someFilter: undefined };
  const selectOptions: Array<SelectOptionLabelKey> = ["views", "shares"];

  const defaultProps = {
    clearFilter: mockClearFilter,
    label: "Sort By",
    onValueChange: mockOnValueChange,
    selectOptions: selectOptions,
    tooltipContent: "Clear sorting",
    value: undefined,
    disabled: false,
  };

  it("renders the label", () => {
    render(<SelectFilter {...defaultProps} />);
    expect(screen.getByLabelText("Sort By")).toBeInTheDocument();
  });

  it("renders the placeholder when no value is selected", () => {
    render(<SelectFilter {...defaultProps} />);
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveTextContent("Sort By");
  });

  it("renders the selected value", () => {
    render(<SelectFilter {...defaultProps} value="views" />);

    expect(screen.getByText("views")).toBeInTheDocument();
  });

  it("renders select options when trigger is clicked", async () => {
    render(<SelectFilter {...defaultProps} />);
    const trigger = screen.getByRole("combobox");
    userEvent.click(trigger);
    expect(await screen.findByText("views")).toBeVisible();
    expect(await screen.findByText("shares")).toBeVisible();
  });

  it("calls onValueChange when an option is selected", async () => {
    render(<SelectFilter {...defaultProps} />);
    const trigger = screen.getByRole("combobox");
    userEvent.click(trigger);

    const option = await screen.findByTestId("select-option-shares");
    fireEvent.click(option);

    expect(mockOnValueChange).toHaveBeenCalledTimes(1);
    expect(mockOnValueChange).toHaveBeenCalledWith("shares");
  });

  it("renders the clear filter button within the dropdown", async () => {
    render(<SelectFilter {...defaultProps} />);
    const trigger = screen.getByRole("combobox");
    userEvent.click(trigger);

    expect(await screen.findByText("Clear")).toBeVisible();
  });

  it("disables the select when disabled prop is true", () => {
    render(<SelectFilter {...defaultProps} disabled={true} />);
    const trigger = screen.getByRole("combobox");
    userEvent.click(trigger);
    expect(trigger).toBeDisabled();
  });
});
