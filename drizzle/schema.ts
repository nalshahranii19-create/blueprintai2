import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  plan: mysqlEnum("plan", ["free", "pro", "business"]).default("free").notNull(),
  planActivatedAt: timestamp("planActivatedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const blueprints = mysqlTable("blueprints", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 512 }).notNull(),
  projectIdea: text("projectIdea").notNull(),
  projectType: varchar("projectType", { length: 128 }).notNull(),
  targetAudience: text("targetAudience").notNull(),
  coreFeatures: text("coreFeatures").notNull(),
  content: text("content").notNull(),
  language: varchar("language", { length: 8 }).default("en").notNull(),
  // Additional context fields for personalization
  industry: varchar("industry", { length: 128 }),
  budget: varchar("budget", { length: 64 }),
  teamSize: varchar("teamSize", { length: 64 }),
  timeline: varchar("timeline", { length: 64 }),
  revenueModel: varchar("revenueModel", { length: 128 }),
  // AI metadata
  modelUsed: varchar("modelUsed", { length: 64 }),
  generationTimeMs: int("generationTimeMs"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Blueprint = typeof blueprints.$inferSelect;
export type InsertBlueprint = typeof blueprints.$inferInsert;

// Section regenerations: track every time a user regenerates a specific section
export const sectionRegenerations = mysqlTable("section_regenerations", {
  id: int("id").autoincrement().primaryKey(),
  blueprintId: int("blueprintId").notNull(),
  userId: int("userId").notNull(),
  sectionKey: varchar("sectionKey", { length: 64 }).notNull(), // e.g. "business_analysis"
  sectionTitle: varchar("sectionTitle", { length: 256 }).notNull(),
  content: text("content").notNull(),
  version: int("version").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SectionRegeneration = typeof sectionRegenerations.$inferSelect;
export type InsertSectionRegeneration = typeof sectionRegenerations.$inferInsert;

// Usage tracking: one row per user per month (YYYY-MM format)
export const usageTracking = mysqlTable("usage_tracking", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  month: varchar("month", { length: 7 }).notNull(), // e.g. "2024-01"
  blueprintsGenerated: int("blueprintsGenerated").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UsageTracking = typeof usageTracking.$inferSelect;
export type InsertUsageTracking = typeof usageTracking.$inferInsert;
