"use client";

import { Suspense } from "react";
import { RoomsSelect } from "./RoomsSelect";
import { DayOfWeekFilter } from "./DayOfWeekFilter";
import { TimeWindowFilter } from "./TimeWindowFilter";
import { RoomsRangeSlider } from "./RoomsRangeSlider";
import type { Building, Campus } from "./types";

export function RoomsFilterPanel(props: {
  buildings: Promise<Building[]>;
  campuses: Promise<Campus[]>;
}) {
  return (
    <div className="bg-neu1 flex h-full min-h-0 w-full flex-col gap-[14px] overflow-y-scroll px-3 pt-6 pb-4">
      <Suspense fallback={<MultiselectSkeleton />}>
        <RoomsSelect
          label="CAMPUS"
          opts={props.campuses}
          spCode="camp"
          placeholder="Search for campuses (Boston,..."
          transform={(opts) =>
            opts
              .filter((o) => o.name)
              .map((o) => ({ label: o.name!, value: o.name! }))
          }
        />
      </Suspense>

      <hr className="border-neu4 border-t-[0.5px]" />

      <Suspense fallback={<MultiselectSkeleton />}>
        <RoomsSelect
          label="BUILDINGS"
          opts={props.buildings}
          spCode="bldg"
          placeholder="Search for building name"
          transform={(opts) =>
            opts.map((o) => ({ label: o.name, value: String(o.id) }))
          }
        />
      </Suspense>

      <hr className="border-neu4 border-t-[0.5px]" />

      <DayOfWeekFilter />

      <hr className="border-neu4 border-t-[0.5px]" />

      <TimeWindowFilter />

      <hr className="border-neu4 border-t-[0.5px]" />

      <RoomsRangeSlider />

      <div className="pb-20 md:hidden" />
    </div>
  );
}

function MultiselectSkeleton() {
  return <div className="bg-neu3 h-9 w-full animate-pulse rounded-lg" />;
}
