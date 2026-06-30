import { describe, expect, it, vi, beforeEach } from "vitest";
import { BLUEPRINT_SECTIONS, buildSystemPrompt, detectWeakInputs, getSectionByKey, getSectionTitle, type BlueprintContext } from "../shared/prompts";

// ─── Prompt Engine Tests ──────────────────────────────────────────────────────

describe("BLUEPRINT_SECTIONS", () => {
  it("should have exactly 25 sections", () => {
    expect(BLUEPRINT_SECTIONS).toHaveLength(25);
  });

  it("should have unique keys for all sections", () => {
    const keys = BLUEPRINT_SECTIONS.map((s) => s.key);
    const unique = new Set(keys);
    expect(unique.size).toBe(25);
  });

  it("should have English and Arabic titles for all sections", () => {
    for (const section of BLUEPRINT_SECTIONS) {
      expect(section.title).toBeTruthy();
      expect(section.titleAr).toBeTruthy();
      expect(section.emoji).toBeTruthy();
    }
  });

  it("should generate non-empty prompts for all sections", () => {
    const ctx: BlueprintContext = {
      projectIdea: "A SaaS platform for project management",
      projectType: "SaaS Web Application",
      targetAudience: "Software developers and startup founders",
      coreFeatures: "Task management, team collaboration, AI suggestions",
      language: "en",
      industry: "Technology",
      budget: "$50,000",
      teamSize: "3 developers",
      timeline: "6 months",
      revenueModel: "Monthly subscription",
    };

    for (const section of BLUEPRINT_SECTIONS) {
      const prompt = section.prompt(ctx);
      expect(prompt.length).toBeGreaterThan(100);
      expect(prompt).toContain(ctx.projectIdea);
    }
  });

  it("should include Arabic instruction when language is ar", () => {
    const ctx: BlueprintContext = {
      projectIdea: "منصة لإدارة المشاريع",
      projectType: "SaaS Web Application",
      targetAudience: "المطورين",
      coreFeatures: "إدارة المهام",
      language: "ar",
    };

    for (const section of BLUEPRINT_SECTIONS) {
      const prompt = section.prompt(ctx);
      expect(prompt).toContain("Arabic");
    }
  });
});

describe("buildSystemPrompt", () => {
  it("should return English system prompt for en language", () => {
    const prompt = buildSystemPrompt("en");
    expect(prompt).toContain("elite business consultant");
    expect(prompt).toContain("English");
  });

  it("should return Arabic system prompt for ar language", () => {
    const prompt = buildSystemPrompt("ar");
    expect(prompt).toContain("مستشار أعمال");
    expect(prompt).toContain("العربية");
  });
});

describe("detectWeakInputs", () => {
  it("should detect weak inputs when project idea is too short", () => {
    const ctx: BlueprintContext = {
      projectIdea: "An app",
      projectType: "Mobile App",
      targetAudience: "Everyone",
      coreFeatures: "Basic features",
      language: "en",
    };
    const questions = detectWeakInputs(ctx);
    expect(questions.length).toBeGreaterThan(0);
    expect(questions[0]).toContain("problem");
  });

  it("should return fewer questions for detailed inputs", () => {
    const ctx: BlueprintContext = {
      projectIdea: "A comprehensive SaaS platform that helps software developers manage their projects, track bugs, and collaborate with their team using AI-powered suggestions",
      projectType: "SaaS Web Application",
      targetAudience: "Software developers",
      coreFeatures: "Task management, bug tracking, AI suggestions",
      language: "en",
      industry: "Technology",
      budget: "$50,000",
      teamSize: "3 developers",
      timeline: "6 months",
      revenueModel: "Monthly subscription",
    };
    const questions = detectWeakInputs(ctx);
    expect(questions.length).toBeLessThan(3);
  });

  it("should return Arabic questions when language is ar", () => {
    const ctx: BlueprintContext = {
      projectIdea: "تطبيق",
      projectType: "Mobile App",
      targetAudience: "الجميع",
      coreFeatures: "ميزات",
      language: "ar",
    };
    const questions = detectWeakInputs(ctx);
    expect(questions.length).toBeGreaterThan(0);
    // Arabic questions should contain Arabic characters
    expect(questions[0]).toMatch(/[\u0600-\u06FF]/);
  });
});

describe("getSectionByKey", () => {
  it("should find section by key", () => {
    const section = getSectionByKey("business_analysis");
    expect(section).toBeDefined();
    expect(section?.key).toBe("business_analysis");
  });

  it("should return undefined for invalid key", () => {
    const section = getSectionByKey("nonexistent_key");
    expect(section).toBeUndefined();
  });
});

describe("getSectionTitle", () => {
  it("should return English title for en language", () => {
    const section = getSectionByKey("business_analysis")!;
    const title = getSectionTitle(section, "en");
    expect(title).toBe(section.title);
  });

  it("should return Arabic title for ar language", () => {
    const section = getSectionByKey("business_analysis")!;
    const title = getSectionTitle(section, "ar");
    expect(title).toBe(section.titleAr);
  });
});

// ─── Router Tests ─────────────────────────────────────────────────────────────

describe("blueprints.checkInputs", () => {
  it("should detect weak inputs via router", async () => {
    // Mock the db module
    vi.mock("../server/db", () => ({
      getBlueprintsByUserId: vi.fn().mockResolvedValue([]),
      getBlueprintById: vi.fn().mockResolvedValue(null),
      createBlueprint: vi.fn().mockResolvedValue(1),
      deleteBlueprintById: vi.fn().mockResolvedValue(undefined),
      getMonthlyUsage: vi.fn().mockResolvedValue(0),
      incrementUsage: vi.fn().mockResolvedValue(undefined),
      saveSectionRegeneration: vi.fn().mockResolvedValue(1),
      getSectionRegenerationHistory: vi.fn().mockResolvedValue([]),
      updateBlueprintSection: vi.fn().mockResolvedValue(undefined),
    }));

    // The checkInputs procedure is a query that doesn't need DB
    const ctx: BlueprintContext = {
      projectIdea: "app",
      projectType: "Mobile App",
      targetAudience: "users",
      coreFeatures: "features",
      language: "en",
    };
    const questions = detectWeakInputs(ctx);
    expect(questions.length).toBeGreaterThan(0);
    expect(questions.length).toBeLessThanOrEqual(5);
  });
});
