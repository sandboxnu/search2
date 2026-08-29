"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/cn";

const DAYS = [
  { label: "Monday", value: "1" },
  { label: "Tuesday", value: "2" },
  { label: "Wednesday", value: "3" },
  { label: "Thursday", value: "4" },
  { label: "Friday", value: "5" },
  { label: "Saturday", value: "6" },
  { label: "Sunday", value: "7" },
] as const;

const WEEKDAYS = ["1", "2", "3", "4", "5"];
const WEEKEND = ["6", "7"];
const ALL = ["1", "2", "3", "4", "5", "6", "7"];

const SP_CODE = "day";

export function DayOfWeekFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const selected = searchParams.getAll(SP_CODE);

  function setDays(days: string[]) {
    const params = new URLSearchParams(searchParams);
    params.delete(SP_CODE);
    days.forEach((d) => params.append(SP_CODE, d));
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
  }

  function toggleDay(value: string) {
    const next = selected.includes(value)
      ? selected.filter((d) => d !== value)
      : [...selected, value];
    setDays(next);
  }

  function toggleGroup(group: string[]) {
    const allSelected = group.every((d) => selected.includes(d));
    if (allSelected) {
      setDays(selected.filter((d) => !group.includes(d)));
    } else {
      setDays(Array.from(new Set([...selected, ...group])));
    }
  }

  const shortcuts = [
    { label: "Weekdays", group: WEEKDAYS },
    { label: "Weekend", group: WEEKEND },
    { label: "All", group: ALL },
  ];

  return (
    <div className="space-y-3">
      <Label className="font-lato text-neu7 text-xs leading-[14px] font-bold uppercase">
        DAY OF THE WEEK
      </Label>
      <div className="space-y-2">
        {DAYS.map((day) => (
          <div key={day.value} className="flex items-center justify-between">
            <Label
              htmlFor={`day-${day.value}`}
              className={cn(
                "font-lato text-xs leading-[18.2px]",
                selected.includes(day.value)
                  ? "text-neu8 font-semibold"
                  : "text-neu6 font-normal",
              )}
            >
              {day.label}
            </Label>
            <Checkbox
              id={`day-${day.value}`}
              checked={selected.includes(day.value)}
              onCheckedChange={() => toggleDay(day.value)}
              className="border-neu6 data-[state=checked]:bg-neu data-[state=checked]:border-neu size-4"
            />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {shortcuts.map(({ label, group }) => {
          const isChecked = group.every((d) => selected.includes(d));
          return (
            <div key={label} className="flex items-center justify-between">
              <Label
                htmlFor={`day-shortcut-${label}`}
                className={cn(
                  "font-lato text-xs leading-[18.2px]",
                  isChecked
                    ? "text-neu8 font-semibold"
                    : "text-neu6 font-normal",
                )}
              >
                {label}
              </Label>
              <Checkbox
                id={`day-shortcut-${label}`}
                checked={isChecked}
                onCheckedChange={() => toggleGroup(group)}
                className="border-neu6 data-[state=checked]:bg-neu data-[state=checked]:border-neu size-4"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
