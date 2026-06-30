import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Check, X, Zap, Crown, Building2, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { PLANS, type PlanId } from "../../../shared/plans";
import { getLoginUrl } from "@/const";
import Navbar from "@/components/Navbar";

const PLAN_ICONS: Record<PlanId, React.ReactNode> = {
  free: <Zap className="w-6 h-6" />,
  pro: <Crown className="w-6 h-6" />,
  business: <Building2 className="w-6 h-6" />,
};

const PLAN_COLORS: Record<PlanId, string> = {
  free: "from-slate-500 to-slate-600",
  pro: "from-indigo-500 to-violet-600",
  business: "from-violet-600 to-purple-700",
};

const FAQ_ITEMS = [
  {
    q: "Can I change my plan anytime?",
    qAr: "هل يمكنني تغيير خطتي في أي وقت؟",
    a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
    aAr: "نعم، يمكنك الترقية أو التخفيض في أي وقت. تسري التغييرات فوراً.",
  },
  {
    q: "What happens when I reach my monthly limit?",
    qAr: "ماذا يحدث عند الوصول للحد الشهري؟",
    a: "You'll see an upgrade prompt. Your existing blueprints remain accessible, but you won't be able to generate new ones until the next month or you upgrade.",
    aAr: "ستظهر لك رسالة للترقية. مخططاتك الموجودة تبقى متاحة، لكن لن تتمكن من توليد مخططات جديدة حتى الشهر القادم أو الترقية.",
  },
  {
    q: "Is there a free trial for Pro?",
    qAr: "هل يوجد تجربة مجانية للخطة الاحترافية؟",
    a: "The Free plan gives you 3 blueprints per month to try the product. No credit card required.",
    aAr: "الخطة المجانية تمنحك 3 مخططات شهرياً لتجربة المنتج. لا يلزم بطاقة ائتمان.",
  },
  {
    q: "Do unused blueprints roll over?",
    qAr: "هل تنتقل المخططات غير المستخدمة للشهر التالي؟",
    a: "No, the monthly limit resets at the start of each month. Unused generations don't carry over.",
    aAr: "لا، يُعاد ضبط الحد الشهري في بداية كل شهر. التوليدات غير المستخدمة لا تنتقل.",
  },
  {
    q: "What payment methods do you accept?",
    qAr: "ما طرق الدفع المقبولة؟",
    a: "We accept all major credit cards, PayPal, and bank transfers for Business plans. Payment processing coming soon.",
    aAr: "نقبل جميع بطاقات الائتمان الرئيسية وPayPal والتحويلات البنكية لخطط الأعمال. معالجة الدفع قريباً.",
  },
];

export default function Pricing() {
  const { t, lang: language } = useI18n();
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { data: myPlan } = trpc.plans.myPlan.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const upgradeMutation = trpc.plans.upgradePlan.useMutation({
    onSuccess: (data) => {
      toast.success(
        language === "ar"
          ? `تم تفعيل خطة ${PLANS[data.plan as PlanId].nameAr} بنجاح!`
          : `Successfully activated ${PLANS[data.plan as PlanId].name} plan!`
      );
      window.location.reload();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSelectPlan = (planId: PlanId) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    if (myPlan?.plan === planId) return;
    upgradeMutation.mutate({ plan: planId });
  };

  const isAr = language === "ar";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-12 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-4 border-indigo-500/50 text-indigo-400 bg-indigo-500/10">
            {isAr ? "الأسعار" : "Pricing"}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {isAr ? "اختر الخطة المناسبة لك" : "Choose the Right Plan"}
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            {isAr
              ? "ابدأ مجاناً وقم بالترقية عندما تحتاج المزيد. لا رسوم خفية."
              : "Start free and upgrade when you need more. No hidden fees."}
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 bg-card border border-border rounded-full p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                billing === "monthly"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isAr ? "شهري" : "Monthly"}
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                billing === "yearly"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isAr ? "سنوي" : "Yearly"}
              <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">
                {isAr ? "وفر 20%" : "Save 20%"}
              </span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Plans Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {(Object.values(PLANS) as typeof PLANS[PlanId][]).map((plan, i) => {
            const isCurrentPlan = myPlan?.plan === plan.id;
            const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const features = isAr ? plan.featuresAr : plan.features;
            const name = isAr ? plan.nameAr : plan.name;
            const badge = isAr ? plan.badgeAr : plan.badge;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative rounded-2xl border p-6 flex flex-col ${
                  plan.highlighted
                    ? "border-indigo-500 bg-gradient-to-b from-indigo-950/50 to-card shadow-xl shadow-indigo-500/10"
                    : "border-border bg-card"
                }`}
              >
                {/* Badge */}
                {badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${PLAN_COLORS[plan.id]} text-white shadow`}>
                      {badge}
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6">
                  <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${PLAN_COLORS[plan.id]} text-white mb-3`}>
                    {PLAN_ICONS[plan.id]}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">
                      {price === 0 ? (isAr ? "مجاني" : "Free") : `$${price}`}
                    </span>
                    {price > 0 && (
                      <span className="text-muted-foreground text-sm">
                        /{isAr ? "شهر" : "mo"}
                        {billing === "yearly" && (
                          <span className="text-xs text-green-400 ms-1">
                            {isAr ? "مدفوع سنوياً" : "billed yearly"}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.blueprintsPerMonth === -1
                      ? (isAr ? "مخططات غير محدودة" : "Unlimited blueprints")
                      : (isAr
                        ? `${plan.blueprintsPerMonth} مخططات / شهر`
                        : `${plan.blueprintsPerMonth} blueprints / month`)}
                  </p>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrentPlan || upgradeMutation.isPending}
                  variant={plan.highlighted ? "default" : "outline"}
                  className={`w-full mb-6 ${
                    plan.highlighted
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : isCurrentPlan
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isCurrentPlan
                    ? (isAr ? "خطتك الحالية" : "Current Plan")
                    : plan.id === "free"
                    ? (isAr ? "ابدأ مجاناً" : "Get Started Free")
                    : (isAr ? `ترقية إلى ${name}` : `Upgrade to ${name}`)}
                </Button>

                {/* Features */}
                <ul className="space-y-3 flex-1">
                  {features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">
            {isAr ? "مقارنة الخطط" : "Plan Comparison"}
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-card/50">
                  <th className="text-start p-4 font-semibold">{isAr ? "الميزة" : "Feature"}</th>
                  <th className="text-center p-4 font-semibold">{isAr ? "مجاني" : "Free"}</th>
                  <th className="text-center p-4 font-semibold text-indigo-400">{isAr ? "احترافي" : "Pro"}</th>
                  <th className="text-center p-4 font-semibold">{isAr ? "أعمال" : "Business"}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: isAr ? "مخططات شهرياً" : "Blueprints / month", free: "3", pro: "30", business: isAr ? "غير محدود" : "Unlimited" },
                  { feature: isAr ? "25 قسماً" : "25 sections", free: true, pro: true, business: true },
                  { feature: isAr ? "تصدير Markdown" : "Markdown export", free: true, pro: true, business: true },
                  { feature: isAr ? "تصدير PDF" : "PDF export", free: false, pro: true, business: true },
                  { feature: isAr ? "دعم العربية" : "Arabic support", free: true, pro: true, business: true },
                  { feature: isAr ? "سجل المخططات" : "Blueprint history", free: true, pro: true, business: true },
                  { feature: isAr ? "توليد ذو أولوية" : "Priority generation", free: false, pro: true, business: true },
                  { feature: isAr ? "تعاون الفريق" : "Team collaboration", free: false, pro: false, business: isAr ? "قريباً" : "Soon" },
                  { feature: isAr ? "وصول API" : "API access", free: false, pro: false, business: isAr ? "قريباً" : "Soon" },
                  { feature: isAr ? "دعم مخصص" : "Dedicated support", free: false, pro: false, business: true },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-border/50 ${i % 2 === 0 ? "bg-card/20" : ""}`}>
                    <td className="p-4 text-muted-foreground">{row.feature}</td>
                    {[row.free, row.pro, row.business].map((val, j) => (
                      <td key={j} className="p-4 text-center">
                        {typeof val === "boolean" ? (
                          val ? (
                            <Check className="w-4 h-4 text-green-400 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />
                          )
                        ) : (
                          <span className={j === 1 ? "text-indigo-400 font-medium" : ""}>{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-indigo-400" />
            {isAr ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
          </h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-start hover:bg-card/50 transition-colors"
                >
                  <span className="font-medium">{isAr ? item.qAr : item.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-muted-foreground">
                    {isAr ? item.aAr : item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-indigo-950/50 to-violet-950/50 border border-indigo-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-2">
              {isAr ? "هل لديك أسئلة؟" : "Have Questions?"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {isAr
                ? "تواصل معنا وسنساعدك في اختيار الخطة المناسبة."
                : "Contact us and we'll help you choose the right plan."}
            </p>
            <Button variant="outline" className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10">
              {isAr ? "تواصل معنا" : "Contact Us"}
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
