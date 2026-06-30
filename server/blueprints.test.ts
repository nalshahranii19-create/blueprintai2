import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database helpers
vi.mock("./db", () => ({
  createBlueprint: vi.fn().mockResolvedValue(42),
  getBlueprintsByUserId: vi.fn().mockResolvedValue([
    {
      id: 1,
      title: "Test Blueprint",
      projectType: "SaaS Web Application",
      language: "en",
      createdAt: new Date("2024-01-01"),
    },
  ]),
  getBlueprintById: vi.fn().mockResolvedValue({
    id: 1,
    userId: 1,
    title: "Test Blueprint",
    projectType: "SaaS Web Application",
    projectIdea: "A test project",
    targetAudience: "Developers",
    coreFeatures: "Feature A, Feature B",
    content: "## 1. Business Analysis\n\nTest content",
    language: "en",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  }),
  deleteBlueprintById: vi.fn().mockResolvedValue(undefined),
  getMonthlyUsage: vi.fn().mockResolvedValue(0),
  trackUsage: vi.fn().mockResolvedValue(undefined),
  incrementUsage: vi.fn().mockResolvedValue(undefined),
  getUserPlan: vi.fn().mockResolvedValue("free"),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
}));

// Mock LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: "## 1. Business Analysis\n\nThis is a test blueprint for a SaaS platform.\n\n## 2. Project Goals\n\nBuild a great product.",
        },
      },
    ],
  }),
}));

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user-openid",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("blueprints router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("list", () => {
    it("returns blueprints for authenticated user", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.blueprints.list();
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Test Blueprint");
    });

    it("throws UNAUTHORIZED for unauthenticated user", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      await expect(caller.blueprints.list()).rejects.toThrow();
    });
  });

  describe("get", () => {
    it("returns blueprint by id for owner", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.blueprints.get({ id: 1 });
      expect(result.id).toBe(1);
      expect(result.title).toBe("Test Blueprint");
    });
  });

  describe("save", () => {
    it("saves blueprint and returns id", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.blueprints.save({
        title: "My Blueprint",
        projectIdea: "A great SaaS idea",
        projectType: "SaaS Web Application",
        targetAudience: "Developers",
        coreFeatures: "Auth, Dashboard, API",
        content: "## 1. Business Analysis\n\nContent here",
        language: "en",
      });
      expect(result.id).toBe(42);
    });

    it("throws UNAUTHORIZED for unauthenticated user", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      await expect(
        caller.blueprints.save({
          title: "My Blueprint",
          projectIdea: "A great SaaS idea",
          projectType: "SaaS Web Application",
          targetAudience: "Developers",
          coreFeatures: "Auth, Dashboard, API",
          content: "Content",
          language: "en",
        })
      ).rejects.toThrow();
    });
  });

  describe("generate", () => {
    it("generates blueprint content from LLM", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.blueprints.generate({
        projectIdea: "A SaaS platform for managing freelance projects and invoices",
        projectType: "SaaS Web Application",
        targetAudience: "Freelancers and independent contractors",
        coreFeatures: "Client management, invoice generation, project tracking",
        language: "en",
      });
      expect(result.content).toContain("Business Analysis");
      expect(result.projectType).toBe("SaaS Web Application");
      expect(result.language).toBe("en");
    });

    it("validates minimum input length", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      await expect(
        caller.blueprints.generate({
          projectIdea: "short",
          projectType: "SaaS Web Application",
          targetAudience: "Users",
          coreFeatures: "Feature",
          language: "en",
        })
      ).rejects.toThrow();
    });
  });

  describe("delete", () => {
    it("deletes blueprint for owner", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.blueprints.delete({ id: 1 });
      expect(result.success).toBe(true);
    });
  });
});
