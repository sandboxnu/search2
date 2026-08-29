"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useState, use } from "react";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandInput,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown, PlusIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface Option {
  label: string;
  value: string;
}

export function RoomsSelect<T>(props: {
  opts: Promise<T[]>;
  spCode: string;
  placeholder: string;
  label: string;
  transform: (opts: T[]) => Option[];
}) {
  const resolved = use(props.opts);
  const options = props
    .transform(resolved)
    .sort((a, b) => a.label.localeCompare(b.label));

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const spSelected = searchParams.getAll(props.spCode);
  const selected = options.filter((o) => spSelected.includes(o.value));

  function updateSearchParams(opts: Option[]) {
    const params = new URLSearchParams(searchParams);
    params.delete(props.spCode);
    opts.forEach((o) => params.append(props.spCode, o.value));
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
  }

  function toggle(opt: Option) {
    updateSearchParams(
      selected.some((s) => s.value === opt.value)
        ? selected.filter((s) => s.value !== opt.value)
        : [...selected, opt],
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label className="text-neu7 font-lato text-xs leading-[14px] font-bold uppercase">
          {props.label}
        </Label>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <p
              className="text-blue hover:text-blue/80 font-lato cursor-pointer text-xs leading-[18.2px] font-normal"
              onClick={() => updateSearchParams([])}
            >
              Clear all
            </p>
          )}
          <PlusIcon
            className={cn(
              "text-neu6 size-5 cursor-pointer",
              open && "rotate-45",
            )}
            onClick={() => setOpen(true)}
          />
        </div>
      </div>

      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <button className="border-neu25 bg-neu2 flex h-[42px] w-full items-center gap-2 rounded-full border px-4 py-3 text-left">
            <span className="text-neu6 font-lato line-clamp-1 flex-1 text-sm leading-[18.2px] font-normal">
              {selected.length > 0
                ? selected.map((s) => s.label).join(", ")
                : props.placeholder}
            </span>
            <ChevronsUpDown className="text-neu6 size-4 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[calc(100vw-30px)] p-0 md:w-[256px]"
          align="start"
        >
          <Command
            filter={(value, search, keywords) => {
              const v = value.toLowerCase();
              const s = search.toLowerCase();
              const label = keywords?.join(" ").toLowerCase();
              if (v === s) return 1;
              if (v.includes(s)) return 0.8;
              if (label?.includes(s)) return 0.7;
              return 0;
            }}
          >
            <CommandInput
              placeholder="Search options..."
              className="text-lg md:text-sm"
            />
            <CommandList className="bg-neu1 max-h-[200px]">
              <CommandEmpty>No results found</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.value}
                    keywords={[opt.label]}
                    onSelect={() => toggle(opt)}
                    className={cn(
                      "text-neu6 py-3 text-sm",
                      selected.some((s) => s.value === opt.value) &&
                        "text-neu8 font-semibold",
                    )}
                  >
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.slice(0, 2).map((s) => (
            <span
              key={s.value}
              className="border-neu25 bg-neu2 text-neu8 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs"
            >
              {s.label}
              <button
                onClick={() => toggle(s)}
                className="text-neu6 hover:text-neu7 leading-none"
              >
                ×
              </button>
            </span>
          ))}
          {selected.length > 2 && (
            <span className="border-neu25 rounded-full border px-3 py-1 text-xs">
              +{selected.length - 2}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
