import { useState } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import {
  User, CreditCard, BarChart3, Crown, Zap, Building2,
  CheckCircle2, AlertCircle, ArrowUpRight, Calendar, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { PLANS, type PlanId } from "../../../shared/plans";
import Navbar from "@/components/Navbar";

const PLAN_ICONS: Record<PlanId, React.ReactNode> = {
  free: <Zap className="w-5 h-5" />,
  pro: <Crown className="w-5 h-5" />,
  business: <Building2 className="w-5 h-5" />,
};

const PLAN_COLORS: Record<PlanId, string> = {
  free: "text-slate-400 bg-slate-500/10 border-slate-500/20",
  pro: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  business: "text-violet-400 bg-violet-500/10 border-violet-500/20",
};

type SettingsTab = "profile" | "subscription" | "usage";

export default function Settings() {
  const { lang: language } = useI18n();
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<SettingsTab>("subscription");

  const isAr = language === "ar";

  const { data: myPlan, isLoading: planLoading, refetch: refetchPlan } = trpc.plans.myPlan.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const { data: usageHistory } = trpc.plans.usageHistory.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const upgradeMutation = trpc.plans.upgradePlan.useMutation({
    onSuccess: (data) => {
      toast.success(
        isAr
          ? `تم تفعيل خطة ${PLANS[data.plan as PlanId].nameAr} بنجاح!`
          : `Successfully activated ${PLANS[data.plan as PlanId].name} plan!`
      );
      refetchPlan();
    },
    onError: (err) => toast.error(err.message),
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const plan = (myPlan?.plan ?? "free") as PlanId;
  const planConfig = PLANS[plan];
  const usedThisMonth = myPlan?.usedThisMonth ?? 0;
  const limit = myPlan?.limit ?? 3;
  const unlimited = myPlan?.unlimited ?? false;
  const usagePercent = unlimited ? 0 : Math.min(100, (usedThisMonth / limit) * 100);

  const TABS = [
    { id: "profile" as SettingsTab, label: isAr ? "الملف الشخصي" : "Profile", icon: User },
    { id: "subscription" as SettingsTab, label: isAr ? "الاشتراك" : "Subscription", icon: CreditCard },
    { id: "usage" as SettingsTab, label: isAr ? "الاستخدام" : "Usage", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">{isAr ? "الإعدادات" : "Settings"}</h1>
          <p className="text-muted-foreground">
            {isAr ? "إدارة حسابك وخطتك واستخدامك" : "Manage your account, plan, and usage"}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="md:w-56 shrink-0">
            <nav className="space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-card"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-6">{isAr ? "الملف الشخصي" : "Profile"}</h2>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{user?.name ?? "—"}</p>
                      <p className="text-muted-foreground text-sm">{user?.email ?? "—"}</p>
                      <div className={`inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-full border text-xs font-medium ${PLAN_COLORS[plan]}`}>
                        {PLAN_ICONS[plan]}
                        {isAr ? planConfig.nameAr : planConfig.name}
                      </div>
                    </div>
                  </div>
                  <Separator className="mb-6" />
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">{isAr ? "الاسم" : "Name"}</label>
                      <div className="bg-background border border-border rounded-lg px-3 py-2 text-sm">
                        {user?.name ?? "—"}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">{isAr ? "البريد الإلكتروني" : "Email"}</label>
                      <div className="bg-background border border-border rounded-lg px-3 py-2 text-sm">
                        {user?.email ?? "—"}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">{isAr ? "طريقة تسجيل الدخول" : "Login Method"}</label>
                      <div className="bg-background border border-border rounded-lg px-3 py-2 text-sm capitalize">
                        {user?.loginMethod ?? "Manus OAuth"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Subscription Tab */}
              {activeTab === "subscription" && (
                <div className="space-y-6">
                  {/* Current Plan Card */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold mb-1">{isAr ? "خطتك الحالية" : "Current Plan"}</h2>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium ${PLAN_COLORS[plan]}`}>
                          {PLAN_ICONS[plan]}
                          {isAr ? planConfig.nameAr : planConfig.name}
                        </div>
                      </div>
                      {plan !== "free" && (
                        <div className="text-end">
                          <p className="text-2xl font-bold">${planConfig.monthlyPrice}</p>
                          <p className="text-xs text-muted-foreground">{isAr ? "/ شهر" : "/ month"}</p>
                        </div>
                      )}
                    </div>

                    {/* Usage bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">
                          {isAr ? "الاستخدام هذا الشهر" : "This month's usage"}
                        </span>
                        <span className={unlimited ? "text-green-400" : usagePercent >= 80 ? "text-amber-400" : "text-foreground"}>
                          {unlimited
                            ? (isAr ? "غير محدود" : "Unlimited")
                            : `${usedThisMonth} / ${limit}`}
                        </span>
                      </div>
                      {!unlimited && (
                        <Progress
                          value={usagePercent}
                          className={`h-2 ${usagePercent >= 100 ? "[&>div]:bg-red-500" : usagePercent >= 80 ? "[&>div]:bg-amber-500" : "[&>div]:bg-indigo-500"}`}
                        />
                      )}
                      {!unlimited && usagePercent >= 80 && (
                        <p className={`text-xs mt-1 flex items-center gap-1 ${usagePercent >= 100 ? "text-red-400" : "text-amber-400"}`}>
                          <AlertCircle className="w-3 h-3" />
                          {usagePercent >= 100
                            ? (isAr ? "وصلت للحد الأقصى هذا الشهر" : "You've reached your monthly limit")
                            : (isAr ? "اقتربت من الحد الأقصى" : "Approaching your monthly limit")}
                        </p>
                      )}
                    </div>

                    {plan !== "business" && (
                      <Link href="/pricing">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
                          <ArrowUpRight className="w-4 h-4 me-2" />
                          {isAr ? "ترقية الخطة" : "Upgrade Plan"}
                        </Button>
                      </Link>
                    )}
                  </div>

                  {/* Plan features */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-semibold mb-4">{isAr ? "مزايا خطتك" : "Your Plan Features"}</h3>
                    <ul className="space-y-2">
                      {(isAr ? planConfig.featuresAr : planConfig.features).map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Available upgrades */}
                  {plan !== "business" && (
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h3 className="font-semibold mb-4">{isAr ? "الترقيات المتاحة" : "Available Upgrades"}</h3>
                      <div className="space-y-3">
                        {(Object.values(PLANS) as typeof PLANS[PlanId][])
                          .filter((p) => p.id !== plan && p.id !== "free")
                          .map((p) => (
                            <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-indigo-500/30 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-lg ${PLAN_COLORS[p.id]}`}>
                                  {PLAN_ICONS[p.id]}
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{isAr ? p.nameAr : p.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {p.blueprintsPerMonth === -1
                                      ? (isAr ? "غير محدود" : "Unlimited")
                                      : `${p.blueprintsPerMonth} ${isAr ? "مخططات/شهر" : "blueprints/mo"}`}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold">${p.monthlyPrice}<span className="text-xs text-muted-foreground font-normal">/mo</span></span>
                                <Button
                                  size="sm"
                                  onClick={() => upgradeMutation.mutate({ plan: p.id })}
                                  disabled={upgradeMutation.isPending}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                  {isAr ? "ترقية" : "Upgrade"}
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Usage Tab */}
              {activeTab === "usage" && (
                <div className="space-y-6">
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-400" />
                      {isAr ? "إحصائيات الاستخدام" : "Usage Statistics"}
                    </h2>

                    {/* Current month summary */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-background rounded-xl p-4 border border-border">
                        <p className="text-xs text-muted-foreground mb-1">{isAr ? "هذا الشهر" : "This Month"}</p>
                        <p className="text-3xl font-bold text-indigo-400">{usedThisMonth}</p>
                        <p className="text-xs text-muted-foreground">{isAr ? "مخططات" : "blueprints"}</p>
                      </div>
                      <div className="bg-background rounded-xl p-4 border border-border">
                        <p className="text-xs text-muted-foreground mb-1">{isAr ? "الحد الشهري" : "Monthly Limit"}</p>
                        <p className="text-3xl font-bold">
                          {unlimited ? "∞" : limit}
                        </p>
                        <p className="text-xs text-muted-foreground">{isAr ? "مخططات" : "blueprints"}</p>
                      </div>
                      <div className="bg-background rounded-xl p-4 border border-border">
                        <p className="text-xs text-muted-foreground mb-1">{isAr ? "المتبقي" : "Remaining"}</p>
                        <p className={`text-3xl font-bold ${unlimited ? "text-green-400" : myPlan?.remaining === 0 ? "text-red-400" : "text-green-400"}`}>
                          {unlimited ? "∞" : myPlan?.remaining ?? 0}
                        </p>
                        <p className="text-xs text-muted-foreground">{isAr ? "مخططات" : "blueprints"}</p>
                      </div>
                    </div>

                    {/* Usage history */}
                    {usageHistory && usageHistory.length > 0 && (
                      <>
                        <Separator className="mb-4" />
                        <h3 className="font-medium mb-3 text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {isAr ? "السجل الشهري" : "Monthly History"}
                        </h3>
                        <div className="space-y-2">
                          {usageHistory.map((row) => (
                            <div key={row.id} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{row.month}</span>
                              <div className="flex items-center gap-3 flex-1 mx-4">
                                <div className="flex-1 bg-background rounded-full h-1.5">
                                  <div
                                    className="bg-indigo-500 h-1.5 rounded-full"
                                    style={{ width: `${unlimited ? 50 : Math.min(100, (row.blueprintsGenerated / limit) * 100)}%` }}
                                  />
                                </div>
                              </div>
                              <span className="font-medium w-8 text-end">{row.blueprintsGenerated}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {(!usageHistory || usageHistory.length === 0) && (
                      <div className="text-center py-8 text-muted-foreground">
                        <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>{isAr ? "لا يوجد سجل استخدام بعد" : "No usage history yet"}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
