import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Combobox({
  values,
  placeholder = "Select...",
  value,
  setValue,
  emptyMessage = "Nothing found",
}: {
  values: Array<{ value: string; label: string }>;
  placeholder?: string;
  value: string;
  setValue: (val?: string) => void;
  emptyMessage?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? values.find((valueToSearch) => valueToSearch.value === value)
                ?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {values.map((valueToSelect) => (
                <CommandItem
                  key={valueToSelect.value}
                  value={valueToSelect.label}
                  onSelect={(currentValue) => {
                    const valueFound = values.find(({ label }) =>
                      currentValue.toLowerCase().includes(label.toLowerCase()),
                    )?.value;
                    if (valueFound === value) {
                      setValue(undefined);
                    } else {
                      setValue(valueFound);
                    }
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === valueToSelect.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {valueToSelect.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
