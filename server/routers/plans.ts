import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getMonthlyUsage, getUsageHistory, updateUserPlan } from "../db";
import { protectedProcedure, router } from "../_core/trpc";
import { canGenerate, getPlanLimit, isUnlimited, PLANS, type PlanId } from "../../shared/plans";

export const plansRouter = router({
  // Get current user's plan info + usage
  myPlan: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;
    const plan = (user.plan ?? "free") as PlanId;
    const usedThisMonth = await getMonthlyUsage(user.id);
    const limit = getPlanLimit(plan);
    const unlimited = isUnlimited(plan);
    const canGenerate_ = canGenerate(plan, usedThisMonth);
    const remaining = unlimited ? -1 : Math.max(0, limit - usedThisMonth);

    return {
      plan,
      planConfig: PLANS[plan],
      usedThisMonth,
      limit,
      unlimited,
      canGenerate: canGenerate_,
      remaining,
      planActivatedAt: user.planActivatedAt ?? null,
    };
  }),

  // Get usage history (last 12 months)
  usageHistory: protectedProcedure.query(async ({ ctx }) => {
    return getUsageHistory(ctx.user.id);
  }),

  // Upgrade/change plan (simulated — no payment gateway yet)
  upgradePlan: protectedProcedure
    .input(z.object({ plan: z.enum(["free", "pro", "business"]) }))
    .mutation(async ({ ctx, input }) => {
      const currentPlan = (ctx.user.plan ?? "free") as PlanId;
      if (currentPlan === input.plan) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are already on this plan",
        });
      }
      await updateUserPlan(ctx.user.id, input.plan as PlanId);
      return { success: true, plan: input.plan };
    }),

  // Get all available plans (public)
  allPlans: protectedProcedure.query(() => {
    return Object.values(PLANS);
  }),
});
