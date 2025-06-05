import {
  boolean,
  decimal,
  foreignKey,
  index,
  integer,
  json,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const coursesT = pgTable(
  "courses",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    term: varchar({ length: 6 })
      .notNull()
      .references(() => termsT.term),
    name: text().notNull(),
    subject: varchar({ length: 6 }).notNull(),
    courseNumber: varchar({ length: 6 }).notNull(),
    description: text().notNull(),
    minCredits: decimal().notNull(),
    maxCredits: decimal().notNull(),
    nupaths: varchar({ length: 200 }).array().notNull(),
    prereqs: jsonb().notNull(),
    coreqs: jsonb().notNull(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    foreignKey({
      columns: [table.term, table.subject],
      foreignColumns: [subjectsT.term, subjectsT.code],
    }),
    unique("term_course").on(table.term, table.subject, table.courseNumber),
  ],
);

export const sectionsT = pgTable(
  "sections",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    term: varchar({ length: 6 })
      .notNull()
      .references(() => termsT.term),
    courseId: integer()
      .notNull()
      .references(() => coursesT.id),
    crn: varchar({ length: 5 }).notNull(),
    faculty: text().notNull(), // TODO: support multiple faculty
    seatCapacity: integer().notNull(),
    seatRemaining: integer().notNull(),
    waitlistCapacity: integer().notNull(),
    waitlistRemaining: integer().notNull(),
    classType: text().notNull(),
    honors: boolean().notNull(),
    campus: text().notNull(),
    meetingTimes: json().notNull(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("crn_idx").on(table.crn),
    index("term_idx").on(table.term),
    unique("term_crn").on(table.term, table.crn),
  ],
);

export const termsT = pgTable("terms", {
  term: varchar({ length: 6 }).primaryKey(),
  name: text().notNull(),
  activeUntil: timestamp().notNull().defaultNow(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const subjectsT = pgTable(
  "subjects",
  {
    term: varchar({ length: 6 })
      .notNull()
      .references(() => termsT.term),
    code: varchar({ length: 6 }).notNull(),
    name: text().notNull(),
  },
  (table) => [primaryKey({ columns: [table.term, table.code] })],
);

export const usersT = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    guid: uuid().notNull().unique().defaultRandom(),
    name: text().notNull(),
    email: text().notNull().unique(),
    image: text(),
    subject: varchar({ length: 255 }).notNull().unique(),
    role: varchar({ length: 100 }).notNull().default("user"),
    trackingLimit: integer().notNull().default(12),
    acceptedTerms: timestamp(),
    phoneNumber: text("phone_number").unique(),
    phoneNumberVerified: boolean("phone_number_verified"),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("guid_idx").on(table.guid),
    uniqueIndex("sub_idx").on(table.subject),
  ],
);

export const trackersT = pgTable(
  "trackers",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer()
      .notNull()
      .references(() => usersT.id),
    sectionId: integer()
      .notNull()
      .references(() => sectionsT.id),
    notificationMethod: varchar({ length: 10 }).notNull().default("SMS"),
    messageCount: integer().notNull().default(0),
    messageLimit: integer().notNull().default(3),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp(),
  },
  (table) => [
    index("tracker_user_idx").on(table.userId),
    index("tracker_section_idx").on(table.sectionId),
  ],
);

export const notificationsT = pgTable("notifications", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull(),
  trackerId: integer().notNull(),
  method: varchar({ length: 10 }).notNull(),
  message: text(),
  sentAt: timestamp().notNull().defaultNow(),
});
