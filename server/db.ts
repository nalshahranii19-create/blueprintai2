import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { blueprints, InsertBlueprint, InsertSectionRegeneration, InsertUser, sectionRegenerations, usageTracking, users } from "../drizzle/schema";
import { ENV } from './_core/env';
import type { PlanId } from "../shared/plans";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── User helpers ────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get user: database not available"); return undefined; }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserPlan(userId: number, plan: PlanId): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users)
    .set({ plan, planActivatedAt: new Date() })
    .where(eq(users.id, userId));
}

// ─── Blueprint helpers ────────────────────────────────────────────────────────

export async function createBlueprint(data: InsertBlueprint) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(blueprints).values(data);
  return result[0].insertId as number;
}

export async function getBlueprintsByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select({
    id: blueprints.id,
    title: blueprints.title,
    projectType: blueprints.projectType,
    language: blueprints.language,
    createdAt: blueprints.createdAt,
  }).from(blueprints).where(eq(blueprints.userId, userId)).orderBy(desc(blueprints.createdAt));
}

export async function getBlueprintById(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(blueprints)
    .where(eq(blueprints.id, id)).limit(1);
  if (result.length === 0) return null;
  if (result[0].userId !== userId) return null;
  return result[0];
}

export async function deleteBlueprintById(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getBlueprintById(id, userId);
  if (!existing) throw new Error("Blueprint not found or not authorized");
  await db.delete(blueprints).where(eq(blueprints.id, id));
}

// ─── Usage tracking helpers ───────────────────────────────────────────────────

function getCurrentMonth(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export async function getMonthlyUsage(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const month = getCurrentMonth();
  const result = await db.select()
    .from(usageTracking)
    .where(and(eq(usageTracking.userId, userId), eq(usageTracking.month, month)))
    .limit(1);
  return result.length > 0 ? result[0].blueprintsGenerated : 0;
}

export async function incrementUsage(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const month = getCurrentMonth();
  // Upsert: increment if exists, insert with 1 if not
  await db.insert(usageTracking)
    .values({ userId, month, blueprintsGenerated: 1 })
    .onDuplicateKeyUpdate({
      set: { blueprintsGenerated: sql`blueprintsGenerated + 1` },
    });
}

export async function getUsageHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select()
    .from(usageTracking)
    .where(eq(usageTracking.userId, userId))
    .orderBy(desc(usageTracking.month))
    .limit(12);
}

// ─── Section regeneration helpers ────────────────────────────────────────────

export async function saveSectionRegeneration(
  data: Omit<InsertSectionRegeneration, "id" | "createdAt">
): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(sectionRegenerations).values(data);
  return result[0].insertId as number;
}

export async function getSectionRegenerationHistory(
  blueprintId: number,
  sectionKey: string
) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(sectionRegenerations)
    .where(
      and(
        eq(sectionRegenerations.blueprintId, blueprintId),
        eq(sectionRegenerations.sectionKey, sectionKey)
      )
    )
    .orderBy(desc(sectionRegenerations.createdAt))
    .limit(10);
}

/** Update a specific section's content in the blueprint's main content field */
export async function updateBlueprintSection(
  blueprintId: number,
  userId: number,
  sectionKey: string,
  newSectionContent: string
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Fetch current blueprint
  const bp = await getBlueprintById(blueprintId, userId);
  if (!bp) throw new Error("Blueprint not found");

  // Replace the section in the full content using section heading markers
  // Sections are separated by '---' and start with '## '
  const sections = bp.content.split(/\n---\n/);
  const { BLUEPRINT_SECTIONS } = await import("../shared/prompts");
  const sectionDef = BLUEPRINT_SECTIONS.find((s) => s.key === sectionKey);

  if (!sectionDef) {
    // If we can't find the section, just append
    await db
      .update(blueprints)
      .set({ content: bp.content + "\n\n---\n\n" + newSectionContent, updatedAt: new Date() })
      .where(eq(blueprints.id, blueprintId));
    return;
  }

  // Find and replace the matching section by its title markers
  const updatedSections = sections.map((section) => {
    if (
      section.includes(sectionDef.title) ||
      section.includes(sectionDef.titleAr)
    ) {
      return newSectionContent;
    }
    return section;
  });

  const updatedContent = updatedSections.join("\n---\n");
  await db
    .update(blueprints)
    .set({ content: updatedContent, updatedAt: new Date() })
    .where(eq(blueprints.id, blueprintId));
}
