import { describe, expect, it } from "vitest";
import { canGenerate, getPlanLimit, isUnlimited, getRemainingGenerations, PLANS } from "../shared/plans";

describe("Plans - limits and checks", () => {
  it("free plan has 3 blueprints per month", () => {
    expect(getPlanLimit("free")).toBe(3);
  });

  it("pro plan has 30 blueprints per month", () => {
    expect(getPlanLimit("pro")).toBe(30);
  });

  it("business plan is unlimited", () => {
    expect(isUnlimited("business")).toBe(true);
    expect(getPlanLimit("business")).toBe(-1);
  });

  it("free plan: can generate when under limit", () => {
    expect(canGenerate("free", 0)).toBe(true);
    expect(canGenerate("free", 2)).toBe(true);
  });

  it("free plan: cannot generate when at limit", () => {
    expect(canGenerate("free", 3)).toBe(false);
    expect(canGenerate("free", 5)).toBe(false);
  });

  it("pro plan: can generate when under limit", () => {
    expect(canGenerate("pro", 0)).toBe(true);
    expect(canGenerate("pro", 29)).toBe(true);
  });

  it("pro plan: cannot generate when at limit", () => {
    expect(canGenerate("pro", 30)).toBe(false);
  });

  it("business plan: always can generate", () => {
    expect(canGenerate("business", 0)).toBe(true);
    expect(canGenerate("business", 1000)).toBe(true);
  });

  it("getRemainingGenerations returns correct remaining for free", () => {
    expect(getRemainingGenerations("free", 0)).toBe(3);
    expect(getRemainingGenerations("free", 2)).toBe(1);
    expect(getRemainingGenerations("free", 3)).toBe(0);
    expect(getRemainingGenerations("free", 5)).toBe(0); // no negative
  });

  it("getRemainingGenerations returns Infinity for business", () => {
    expect(getRemainingGenerations("business", 0)).toBe(Infinity);
    expect(getRemainingGenerations("business", 999)).toBe(Infinity);
  });

  it("all plans have required fields", () => {
    for (const plan of Object.values(PLANS)) {
      expect(plan.id).toBeTruthy();
      expect(plan.name).toBeTruthy();
      expect(plan.nameAr).toBeTruthy();
      expect(plan.features.length).toBeGreaterThan(0);
      expect(plan.featuresAr.length).toBeGreaterThan(0);
      expect(plan.features.length).toBe(plan.featuresAr.length);
    }
  });

  it("pro plan is highlighted", () => {
    expect(PLANS.pro.highlighted).toBe(true);
    expect(PLANS.free.highlighted).toBe(false);
    expect(PLANS.business.highlighted).toBe(false);
  });

  it("pro and business have badges", () => {
    expect(PLANS.pro.badge).toBeTruthy();
    expect(PLANS.business.badge).toBeTruthy();
  });
});
