import { Link } from "wouter";
import { AlertCircle, Zap, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

export default function UsageBanner() {
  const { lang: language } = useI18n();
  const { isAuthenticated } = useAuth();
  const isAr = language === "ar";

  const { data: myPlan } = trpc.plans.myPlan.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated || !myPlan) return null;
  if (myPlan.unlimited) return null;

  const { usedThisMonth, limit, remaining, plan } = myPlan;
  const usagePercent = Math.min(100, (usedThisMonth / limit) * 100);

  // Only show when >= 66% used
  if (usagePercent < 66) return null;

  const isAtLimit = remaining === 0;

  return (
    <div className={`border rounded-xl p-4 mb-4 ${
      isAtLimit
        ? "bg-red-950/30 border-red-500/30"
        : "bg-amber-950/30 border-amber-500/30"
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 flex-1">
          <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${isAtLimit ? "text-red-400" : "text-amber-400"}`} />
          <div className="flex-1">
            <p className={`text-sm font-medium ${isAtLimit ? "text-red-400" : "text-amber-400"}`}>
              {isAtLimit
                ? (isAr ? "وصلت للحد الشهري" : "Monthly limit reached")
                : (isAr ? "اقتربت من الحد الشهري" : "Approaching monthly limit")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isAr
                ? `استخدمت ${usedThisMonth} من ${limit} مخططات هذا الشهر`
                : `Used ${usedThisMonth} of ${limit} blueprints this month`}
            </p>
            <Progress
              value={usagePercent}
              className={`h-1.5 mt-2 ${isAtLimit ? "[&>div]:bg-red-500" : "[&>div]:bg-amber-500"}`}
            />
          </div>
        </div>
        <Link href="/pricing">
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0">
            <Zap className="w-3 h-3 me-1" />
            {isAr ? "ترقية" : "Upgrade"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
