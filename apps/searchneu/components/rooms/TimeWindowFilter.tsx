"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

const SP_CODE = "tw";
const DEFAULT = "0900-1700";

export function TimeWindowFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const tw = searchParams.get(SP_CODE) ?? DEFAULT;
  const [start, end] = tw.split("-");

  function updateWindow(part: "start" | "end", val: string) {
    const params = new URLSearchParams(searchParams);
    const next = part === "start" ? `${val}-${end}` : `${start}-${val}`;
    params.set(SP_CODE, next);
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
  }

  const isCustom = searchParams.has(SP_CODE);

  function clearWindow() {
    const params = new URLSearchParams(searchParams);
    params.delete(SP_CODE);
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="font-lato text-neu7 text-xs leading-[14px] font-bold uppercase">
          TIME WINDOW
        </Label>
        {isCustom && (
          <p
            className="font-lato text-blue hover:text-blue/80 cursor-pointer text-xs leading-[18.2px] font-normal"
            onClick={clearWindow}
          >
            Clear all
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <TimeInput value={start} onChange={(v) => updateWindow("start", v)} />
        <span className="font-lato text-neu6 text-sm leading-[18.2px] font-normal">
          to
        </span>
        <TimeInput value={end} onChange={(v) => updateWindow("end", v)} />
      </div>
    </div>
  );
}

function to12hr(val: string): string {
  const h = parseInt(val.slice(0, 2));
  const m = val.slice(2);
  const ampm = h >= 12 ? "PM" : "AM";
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:${m} ${ampm}`;
}

function to24hr(input: string): string {
  const match = input.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return "0900";
  let h = parseInt(match[1]);
  const m = match[2];
  const ampm = match[3].toUpperCase();
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}${m}`;
}

function TimeInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="text"
      defaultValue={to12hr(value)}
      onBlur={(e) => onChange(to24hr(e.target.value))}
      className={cn(
        "font-lato text-neu6 border-neu25 bg-neu1",
        "flex w-[90px] items-center justify-center rounded-lg border",
        "px-3 py-1 text-sm leading-[18.2px] font-normal",
        "focus:ring-0 focus:outline-none",
      )}
      placeholder="9:00 AM"
    />
  );
}
