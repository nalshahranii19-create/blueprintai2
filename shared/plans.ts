// Plan definitions — single source of truth for both server and client

export type PlanId = "free" | "pro" | "business";

export interface PlanConfig {
  id: PlanId;
  name: string;
  nameAr: string;
  monthlyPrice: number;   // USD
  yearlyPrice: number;    // USD per month (billed annually)
  blueprintsPerMonth: number; // -1 = unlimited
  features: string[];
  featuresAr: string[];
  highlighted: boolean;
  badge?: string;
  badgeAr?: string;
}

export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    nameAr: "مجاني",
    monthlyPrice: 0,
    yearlyPrice: 0,
    blueprintsPerMonth: 3,
    highlighted: false,
    features: [
      "3 blueprints per month",
      "25 sections per blueprint",
      "Export as Markdown",
      "English & Arabic support",
      "Basic dashboard",
    ],
    featuresAr: [
      "3 مخططات شهرياً",
      "25 قسماً لكل مخطط",
      "تصدير كـ Markdown",
      "دعم العربية والإنجليزية",
      "لوحة تحكم أساسية",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    nameAr: "احترافي",
    monthlyPrice: 19,
    yearlyPrice: 15,
    blueprintsPerMonth: 30,
    highlighted: true,
    badge: "Most Popular",
    badgeAr: "الأكثر شيوعاً",
    features: [
      "30 blueprints per month",
      "25 sections per blueprint",
      "Export as Markdown & PDF",
      "English & Arabic support",
      "Advanced dashboard",
      "Blueprint history",
      "Priority generation",
      "Email support",
    ],
    featuresAr: [
      "30 مخططاً شهرياً",
      "25 قسماً لكل مخطط",
      "تصدير كـ Markdown و PDF",
      "دعم العربية والإنجليزية",
      "لوحة تحكم متقدمة",
      "سجل المخططات",
      "توليد ذو أولوية",
      "دعم عبر البريد الإلكتروني",
    ],
  },
  business: {
    id: "business",
    name: "Business",
    nameAr: "أعمال",
    monthlyPrice: 49,
    yearlyPrice: 39,
    blueprintsPerMonth: -1,
    highlighted: false,
    badge: "Best Value",
    badgeAr: "أفضل قيمة",
    features: [
      "Unlimited blueprints",
      "25 sections per blueprint",
      "Export as Markdown & PDF",
      "English & Arabic support",
      "Advanced dashboard",
      "Blueprint history",
      "Priority generation",
      "Team collaboration (coming soon)",
      "API access (coming soon)",
      "Dedicated support",
    ],
    featuresAr: [
      "مخططات غير محدودة",
      "25 قسماً لكل مخطط",
      "تصدير كـ Markdown و PDF",
      "دعم العربية والإنجليزية",
      "لوحة تحكم متقدمة",
      "سجل المخططات",
      "توليد ذو أولوية",
      "تعاون الفريق (قريباً)",
      "وصول API (قريباً)",
      "دعم مخصص",
    ],
  },
};

export function getPlanLimit(plan: PlanId): number {
  return PLANS[plan].blueprintsPerMonth;
}

export function isUnlimited(plan: PlanId): boolean {
  return PLANS[plan].blueprintsPerMonth === -1;
}

export function canGenerate(plan: PlanId, usedThisMonth: number): boolean {
  if (isUnlimited(plan)) return true;
  return usedThisMonth < PLANS[plan].blueprintsPerMonth;
}

export function getRemainingGenerations(plan: PlanId, usedThisMonth: number): number {
  if (isUnlimited(plan)) return Infinity;
  return Math.max(0, PLANS[plan].blueprintsPerMonth - usedThisMonth);
}
