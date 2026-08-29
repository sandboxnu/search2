"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { type ReactNode } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import { RoomsFilterPanel } from "./RoomsFilterPanel";
import type { Building, Campus } from "./types";

const RoomResults = dynamic(() => import("./RoomResults"), {
  ssr: false,
});

export function RoomsWrapper(props: {
  buildings: Promise<Building[]>;
  campuses: Promise<Campus[]>;
  roomPage: ReactNode;
}) {
  const { room } = useParams();

  return (
    <div className="flex h-[calc(100dvh-56px)] w-screen min-w-0">
      <div
        data-show={Boolean(room)}
        className="border-neu3 bg-neu1 hidden h-full w-[304px] shrink-0 border-r md:block md:data-[show=true]:hidden xl:block!"
      >
        <RoomsFilterPanel
          buildings={props.buildings}
          campuses={props.campuses}
        />
      </div>

      <div className="bg-neu2 flex min-h-0 flex-1 flex-col gap-4 px-4 pt-6 pb-0">
        <div className="flex items-center gap-2">
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="bg-neu1 rounded-full md:hidden"
              >
                <ListFilter className="text-neu6 size-4" strokeWidth={2} />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[95dvh]">
              <DrawerTitle className="text-center">Room Filters</DrawerTitle>
              <div className="overflow-y-scroll">
                <RoomsFilterPanel
                  buildings={props.buildings}
                  campuses={props.campuses}
                />
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button className="rounded-full">View all results</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* to do: Search bar goes here */}
        </div>

        {/* Results + room detail */}
        <div className="flex h-full min-h-0 w-full min-w-0">
          <div
            data-show={Boolean(room)}
            className="w-full data-[show=false]:block data-[show=true]:hidden xl:block! xl:max-w-[320px]"
          >
            <RoomResults />
          </div>
          <div
            data-show={Boolean(room)}
            className="hidden min-w-0 flex-1 data-[show=true]:block xl:block"
          >
            {props.roomPage}
          </div>
        </div>
      </div>
    </div>
  );
}
