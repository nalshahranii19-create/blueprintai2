import { Link } from "wouter";
import { Crown, Zap, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";
import { PLANS } from "../../../shared/plans";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  currentPlan?: string;
  reason?: "limit_reached" | "feature_locked";
}

export default function UpgradeModal({ open, onClose, currentPlan = "free", reason = "limit_reached" }: UpgradeModalProps) {
  const { lang: language } = useI18n();
  const isAr = language === "ar";

  if (!open) return null;

  const pro = PLANS.pro;
  const business = PLANS.business;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 end-4 p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-xl">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {reason === "limit_reached"
                  ? (isAr ? "وصلت للحد الشهري" : "Monthly Limit Reached")
                  : (isAr ? "ميزة مدفوعة" : "Premium Feature")}
              </h2>
              <p className="text-white/80 text-sm">
                {reason === "limit_reached"
                  ? (isAr
                    ? "قم بالترقية للحصول على المزيد من المخططات"
                    : "Upgrade to generate more blueprints")
                  : (isAr
                    ? "هذه الميزة متاحة في الخطط المدفوعة"
                    : "This feature is available on paid plans")}
              </p>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[pro, business].map((plan) => (
              <div
                key={plan.id}
                className={`rounded-xl border p-4 ${
                  plan.id === "pro"
                    ? "border-indigo-500/50 bg-indigo-950/30"
                    : "border-violet-500/50 bg-violet-950/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Crown className={`w-4 h-4 ${plan.id === "pro" ? "text-indigo-400" : "text-violet-400"}`} />
                  <span className="font-semibold text-sm">{isAr ? plan.nameAr : plan.name}</span>
                </div>
                <p className="text-2xl font-bold mb-1">
                  ${plan.monthlyPrice}
                  <span className="text-xs text-muted-foreground font-normal">/mo</span>
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  {plan.blueprintsPerMonth === -1
                    ? (isAr ? "غير محدود" : "Unlimited")
                    : `${plan.blueprintsPerMonth} ${isAr ? "مخططات" : "blueprints"}`}
                </p>
                <ul className="space-y-1">
                  {(isAr ? plan.featuresAr : plan.features).slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-green-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/pricing" onClick={onClose}>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                <Zap className="w-4 h-4 me-2" />
                {isAr ? "عرض جميع الخطط والترقية" : "View All Plans & Upgrade"}
              </Button>
            </Link>
            <Button variant="ghost" onClick={onClose} className="w-full text-muted-foreground">
              {isAr ? "ربما لاحقاً" : "Maybe Later"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
