"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const MIN = 5;
const MAX = 100;

const MAJOR_TICKS = [5, 20, 50, 100];
// 1 minor tick between each major pair + one after 100
const MINOR_TICKS = [12.5, 35, 75, 100 + (100 - 50) / 2].map(
  (v) => ((v - MIN) / (MAX - MIN)) * 100,
);

function pct(v: number) {
  return ((v - MIN) / (MAX - MIN)) * 100;
}

export function RoomsRangeSlider() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [d, setD] = useState([
    Number.parseInt(searchParams.get("nca") ?? String(MIN)),
    Number.parseInt(searchParams.get("xca") ?? String(MAX)),
  ]);

  useEffect(() => {
    function updateSearchParams(range: number[]) {
      const params = new URLSearchParams(searchParams);
      if (range[0] === MIN && range[1] === MAX) {
        params.delete("nca");
        params.delete("xca");
        window.history.pushState(null, "", `${pathname}?${params.toString()}`);
        return;
      }
      params.set("nca", String(range[0]));
      params.set("xca", String(range[1]));
      window.history.pushState(null, "", `${pathname}?${params.toString()}`);
    }

    const timeoutId = setTimeout(() => updateSearchParams(d), 500);
    return () => clearTimeout(timeoutId);
  });

  return (
    <div className="space-y-2">
      <Label className="font-lato text-neu7 text-xs leading-[14px] font-bold uppercase">
        APPROX. ROOM CAPACITY
      </Label>

      <div className="relative pt-1">
        <Slider
          className="**:data-[slot=slider-thumb]:bg-neu **:data-[slot=slider-range]:bg-neu **:data-[slot=slider-track]:bg-neu4 **:data-[slot=slider-thumb]:size-3 **:data-[slot=slider-thumb]:border-0 **:data-[slot=slider-thumb]:shadow-none **:data-[slot=slider-track]:h-[1px]"
          value={d}
          onValueChange={setD}
          min={MIN}
          max={MAX}
          step={1}
        />

        <div className="relative mt-1 h-3">
          {MAJOR_TICKS.map((v, i) => (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{ left: `${pct(v)}%`, transform: "translateX(-50%)" }}
            >
              <div className="bg-neu6 h-3 w-px" />
            </div>
          ))}
        </div>

        <div className="relative -mt-2 h-2">
          {[
            // between 5 and 20
            pct(12.5),
            // between 20 and 50
            pct(35),
            // between 50 and 100
            pct(75),
            // after 100 (at end of track)
            pct(100),
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
            >
              <div className="bg-neu6 h-2 w-px" />
            </div>
          ))}
        </div>

        <div className="relative mt-1">
          {MAJOR_TICKS.map((tick, i) => (
            <span
              key={i}
              className="font-lato text-neu6 absolute text-xs leading-[9px] font-normal"
              style={{ left: `${pct(tick)}%`, transform: "translateX(-50%)" }}
            >
              {tick}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
