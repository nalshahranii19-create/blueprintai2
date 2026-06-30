import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createBlueprint,
  deleteBlueprintById,
  getBlueprintById,
  getBlueprintsByUserId,
  getMonthlyUsage,
  incrementUsage,
  saveSectionRegeneration,
  getSectionRegenerationHistory,
  updateBlueprintSection,
} from "../db";
import { invokeLLM } from "../_core/llm";
import { protectedProcedure, router } from "../_core/trpc";
import { canGenerate, type PlanId } from "../../shared/plans";
import {
  BLUEPRINT_SECTIONS,
  BlueprintContext,
  buildSystemPrompt,
  detectWeakInputs,
  getSectionByKey,
  getSectionTitle,
} from "../../shared/prompts";

export const PROJECT_TYPES = [
  "SaaS Web Application",
  "Mobile App",
  "E-commerce Platform",
  "API / Backend Service",
  "AI / ML Product",
  "Marketplace",
  "Social Platform",
  "Internal Tool / Dashboard",
  "Browser Extension",
  "Other",
] as const;

/** Retry LLM call with exponential backoff */
async function invokeLLMWithRetry(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  maxTokens: number,
  retries = 3
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await invokeLLM({ messages, maxTokens });
      const rawContent = response.choices?.[0]?.message?.content ?? "";
      const content = typeof rawContent === "string" ? rawContent : "";
      if (content.length > 100) return content;
      throw new Error("Response too short, retrying...");
    } catch (err) {
      lastError = err as Error;
      if (attempt < retries - 1) {
        // Exponential backoff: 1s, 2s, 4s
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: `AI generation failed after ${retries} attempts: ${lastError?.message}`,
  });
}

/** Generate a single section content */
async function generateSection(
  section: (typeof BLUEPRINT_SECTIONS)[0],
  ctx: BlueprintContext
): Promise<string> {
  const systemPrompt = buildSystemPrompt(ctx.language);
  const userPrompt = section.prompt(ctx);

  const content = await invokeLLMWithRetry(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    2500
  );

  const title = getSectionTitle(section, ctx.language);
  return `## ${title}\n\n${content.trim()}`;
}

/** Generate all 25 sections sequentially with batching for performance */
async function generateAllSections(ctx: BlueprintContext): Promise<string> {
  const results: string[] = [];

  // Process sections in batches of 5 for better performance
  const batchSize = 5;
  for (let i = 0; i < BLUEPRINT_SECTIONS.length; i += batchSize) {
    const batch = BLUEPRINT_SECTIONS.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((section) => generateSection(section, ctx))
    );
    results.push(...batchResults);
  }

  return results.join("\n\n---\n\n");
}

export const blueprintsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return getBlueprintsByUserId(ctx.user.id);
  }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const bp = await getBlueprintById(input.id, ctx.user.id);
      if (!bp) throw new TRPCError({ code: "NOT_FOUND", message: "Blueprint not found" });
      return bp;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await deleteBlueprintById(input.id, ctx.user.id);
      return { success: true };
    }),

  save: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        projectIdea: z.string().min(1),
        projectType: z.string().min(1),
        targetAudience: z.string().min(1),
        coreFeatures: z.string().min(1),
        content: z.string().min(1),
        language: z.enum(["en", "ar"]).default("en"),
        industry: z.string().optional(),
        budget: z.string().optional(),
        teamSize: z.string().optional(),
        timeline: z.string().optional(),
        revenueModel: z.string().optional(),
        generationTimeMs: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = await createBlueprint({ ...input, userId: ctx.user.id });
      return { id };
    }),

  /** Check if inputs are strong enough or suggest follow-up questions */
  checkInputs: protectedProcedure
    .input(
      z.object({
        projectIdea: z.string(),
        projectType: z.string(),
        targetAudience: z.string(),
        coreFeatures: z.string(),
        language: z.enum(["en", "ar"]).default("en"),
        industry: z.string().optional(),
        budget: z.string().optional(),
        teamSize: z.string().optional(),
        timeline: z.string().optional(),
        revenueModel: z.string().optional(),
      })
    )
    .query(({ input }) => {
      const ctx: BlueprintContext = {
        ...input,
        language: input.language as "en" | "ar",
      };
      const questions = detectWeakInputs(ctx);
      return {
        hasWeakInputs: questions.length > 2,
        questions,
        inputStrength: Math.max(0, 100 - questions.length * 15),
      };
    }),

  /** Main generate procedure - generates all 25 sections with advanced AI */
  generate: protectedProcedure
    .input(
      z.object({
        projectIdea: z.string().min(10).max(3000),
        projectType: z.string().min(1),
        targetAudience: z.string().min(5).max(1000),
        coreFeatures: z.string().min(5).max(2000),
        language: z.enum(["en", "ar"]).default("en"),
        // Optional enrichment fields
        industry: z.string().max(128).optional(),
        budget: z.string().max(64).optional(),
        teamSize: z.string().max(64).optional(),
        timeline: z.string().max(64).optional(),
        revenueModel: z.string().max(128).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check plan limits
      const plan = (ctx.user.plan ?? "free") as PlanId;
      const usedThisMonth = await getMonthlyUsage(ctx.user.id);
      if (!canGenerate(plan, usedThisMonth)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `PLAN_LIMIT_REACHED:${plan}`,
        });
      }

      const startTime = Date.now();

      const blueprintCtx: BlueprintContext = {
        projectIdea: input.projectIdea,
        projectType: input.projectType,
        targetAudience: input.targetAudience,
        coreFeatures: input.coreFeatures,
        language: input.language,
        industry: input.industry,
        budget: input.budget,
        teamSize: input.teamSize,
        timeline: input.timeline,
        revenueModel: input.revenueModel,
      };

      // Generate all 25 sections with advanced prompts
      const content = await generateAllSections(blueprintCtx);
      const generationTimeMs = Date.now() - startTime;

      if (!content || content.length < 500) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate blueprint content",
        });
      }

      // Extract a meaningful title from the project idea
      const titleWords = input.projectIdea
        .replace(/[^\w\s]/g, " ")
        .trim()
        .split(/\s+/)
        .slice(0, 8)
        .join(" ");
      const title =
        titleWords.length > 10 ? titleWords.slice(0, 100) : input.projectIdea.slice(0, 100);

      // Track usage
      await incrementUsage(ctx.user.id);

      return {
        title,
        content,
        projectIdea: input.projectIdea,
        projectType: input.projectType,
        targetAudience: input.targetAudience,
        coreFeatures: input.coreFeatures,
        language: input.language,
        industry: input.industry,
        budget: input.budget,
        teamSize: input.teamSize,
        timeline: input.timeline,
        revenueModel: input.revenueModel,
        generationTimeMs,
        sectionsCount: BLUEPRINT_SECTIONS.length,
      };
    }),

  /** Regenerate a single section without regenerating the entire blueprint */
  regenerateSection: protectedProcedure
    .input(
      z.object({
        blueprintId: z.number(),
        sectionKey: z.string(),
        // Blueprint context for personalization
        projectIdea: z.string().min(10),
        projectType: z.string().min(1),
        targetAudience: z.string().min(5),
        coreFeatures: z.string().min(5),
        language: z.enum(["en", "ar"]).default("en"),
        industry: z.string().optional(),
        budget: z.string().optional(),
        teamSize: z.string().optional(),
        timeline: z.string().optional(),
        revenueModel: z.string().optional(),
        // Optional feedback to improve regeneration
        feedback: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const bp = await getBlueprintById(input.blueprintId, ctx.user.id);
      if (!bp) throw new TRPCError({ code: "NOT_FOUND", message: "Blueprint not found" });

      const section = getSectionByKey(input.sectionKey);
      if (!section) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid section key" });
      }

      const blueprintCtx: BlueprintContext = {
        projectIdea: input.projectIdea,
        projectType: input.projectType,
        targetAudience: input.targetAudience,
        coreFeatures: input.coreFeatures,
        language: input.language,
        industry: input.industry,
        budget: input.budget,
        teamSize: input.teamSize,
        timeline: input.timeline,
        revenueModel: input.revenueModel,
      };

      const systemPrompt = buildSystemPrompt(input.language);
      let userPrompt = section.prompt(blueprintCtx);

      // Add feedback context if provided
      if (input.feedback) {
        userPrompt +=
          input.language === "ar"
            ? `\n\nملاحظة مهمة: ${input.feedback}\nيرجى مراعاة هذه الملاحظة في إجابتك.`
            : `\n\nIMPORTANT FEEDBACK: ${input.feedback}\nPlease incorporate this feedback into your response.`;
      }

      const newContent = await invokeLLMWithRetry(
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        2500
      );

      const sectionTitle = getSectionTitle(section, input.language);
      const formattedContent = `## ${sectionTitle}\n\n${newContent.trim()}`;

      // Get current version count for this section
      const history = await getSectionRegenerationHistory(input.blueprintId, input.sectionKey);
      const version = history.length + 1;

      // Save to regeneration history
      await saveSectionRegeneration({
        blueprintId: input.blueprintId,
        userId: ctx.user.id,
        sectionKey: input.sectionKey,
        sectionTitle,
        content: formattedContent,
        version,
      });

      // Update the blueprint's main content with the new section
      await updateBlueprintSection(input.blueprintId, ctx.user.id, input.sectionKey, formattedContent);

      return {
        sectionKey: input.sectionKey,
        sectionTitle,
        content: formattedContent,
        version,
      };
    }),

  /** Get regeneration history for a section */
  getSectionHistory: protectedProcedure
    .input(
      z.object({
        blueprintId: z.number(),
        sectionKey: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify ownership
      const bp = await getBlueprintById(input.blueprintId, ctx.user.id);
      if (!bp) throw new TRPCError({ code: "NOT_FOUND", message: "Blueprint not found" });

      return getSectionRegenerationHistory(input.blueprintId, input.sectionKey);
    }),

  /** Get all available section definitions */
  getSections: protectedProcedure.query(() => {
    return BLUEPRINT_SECTIONS.map((s) => ({
      key: s.key,
      title: s.title,
      titleAr: s.titleAr,
      emoji: s.emoji,
    }));
  }),
});
