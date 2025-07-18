"use server";

import { cookies } from "next/headers";
import { config } from "./auth";
import { getGuid } from "./utils";
import { db } from "@/db";
import { trackersT, usersT } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export async function createTrackerAction(id: number) {
  const guid = await getGuid();
  if (!guid) {
    const cookieJar = await cookies();
    cookieJar.delete(config.cookieName);

    return { ok: false, msg: "no valid session" };
  }

  const user = await db.query.usersT.findFirst({
    where: eq(usersT.guid, guid),
  });

  if (!user) {
    const cookieJar = await cookies();
    cookieJar.delete(config.cookieName);

    return { ok: false, msg: "no user found matching session" };
  }

  if (!user.phoneNumberVerified)
    return { ok: false, msg: "phone number not verified" };

  const existingTrackers = await db.query.trackersT.findMany({
    where: and(
      eq(trackersT.userId, user.id),
      // eq(trackersT.crn, crn),
      isNull(trackersT.deletedAt),
    ),
  });

  if (user.trackingLimit <= existingTrackers.length)
    return { ok: false, msg: "tracker limit reached" };

  if (existingTrackers.filter((t) => t.sectionId === id).length > 0) {
    return { ok: false, msg: "existing tracker found" };
  }

  await db.insert(trackersT).values({
    userId: user.id,
    sectionId: id,
  });

  return { ok: true };
}

export async function deleteTrackerAction(id: number) {
  const guid = await getGuid();
  if (!guid) {
    const cookieJar = await cookies();
    cookieJar.delete(config.cookieName);

    return { ok: false, msg: "no valid session" };
  }

  const user = await db.query.usersT.findFirst({
    where: eq(usersT.guid, guid),
  });

  if (!user) {
    const cookieJar = await cookies();
    cookieJar.delete(config.cookieName);

    return { ok: false, msg: "no user found matching session" };
  }

  await db
    .update(trackersT)
    .set({
      deletedAt: new Date(),
    })
    .where(
      and(
        eq(trackersT.userId, user.id),
        eq(trackersT.sectionId, id),
        isNull(trackersT.deletedAt),
      ),
    );

  return { ok: true };
}
