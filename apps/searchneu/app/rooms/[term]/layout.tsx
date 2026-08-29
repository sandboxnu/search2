import { type ReactNode, Suspense } from "react";
import { db, buildingsT, roomsT } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { eq } from "drizzle-orm";
import { getCampuses } from "@/lib/dal/campuses";
import { RoomsWrapper } from "@/components/rooms/RoomsWrapper";

const cachedBuildings = unstable_cache(
  async () => {
    return db
      .selectDistinct({ id: buildingsT.id, name: buildingsT.name })
      .from(buildingsT)
      .innerJoin(roomsT, eq(roomsT.buildingId, buildingsT.id))
      .orderBy(buildingsT.name);
  },
  ["rooms.buildings.filter"],
  { revalidate: 3600, tags: ["rooms.buildings"] },
);

const cachedCampuses = unstable_cache(async () => getCampuses(), [], {
  revalidate: 3600,
  tags: ["banner.campuses"],
});

export default async function Layout({ children }: { children: ReactNode }) {
  const buildings = cachedBuildings();
  const campuses = cachedCampuses();

  return (
    <Suspense>
      <RoomsWrapper
        buildings={buildings}
        campuses={campuses}
        roomPage={children}
      />
    </Suspense>
  );
}
