import { useI18n } from "@/contexts/I18nContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Cpu, Zap, Globe, Download, Shield, Map,
  ArrowRight, ChevronRight, Sparkles, Database, Code2, Lock,
  Star, CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1 }
  }),
};

export default function Home() {
  const { t, isRTL } = useI18n();

  const features = [
    { icon: Cpu, title: t.feature_1_title, desc: t.feature_1_desc, color: "text-indigo-400" },
    { icon: Zap, title: t.feature_2_title, desc: t.feature_2_desc, color: "text-violet-400" },
    { icon: Globe, title: t.feature_3_title, desc: t.feature_3_desc, color: "text-purple-400" },
    { icon: Download, title: t.feature_4_title, desc: t.feature_4_desc, color: "text-blue-400" },
    { icon: Shield, title: t.feature_5_title, desc: t.feature_5_desc, color: "text-indigo-300" },
    { icon: Map, title: t.feature_6_title, desc: t.feature_6_desc, color: "text-violet-300" },
  ];

  const steps = [
    { num: "01", icon: Code2, title: t.step_1_title, desc: t.step_1_desc },
    { num: "02", icon: Sparkles, title: t.step_2_title, desc: t.step_2_desc },
    { num: "03", icon: Database, title: t.step_3_title, desc: t.step_3_desc },
  ];

  const stats = [
    { value: "25", label: t.hero_stats_sections },
    { value: "< 30s", label: t.hero_stats_time },
    { value: "100%", label: isRTL ? "مجاني للبدء" : "Free to Start" },
  ];

  const blueprintSections = [
    isRTL ? "تحليل الأعمال" : "Business Analysis",
    isRTL ? "تصميم قاعدة البيانات" : "Database Design",
    isRTL ? "بنية API" : "API Architecture",
    isRTL ? "الأمان" : "Security",
    isRTL ? "خطة النشر" : "Deployment Plan",
    isRTL ? "خارطة الطريق" : "Dev Roadmap",
    isRTL ? "نموذج الإيرادات" : "Revenue Model",
    isRTL ? "استراتيجية التسويق" : "Marketing Strategy",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -start-40 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute top-20 -end-20 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="absolute bottom-0 start-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-purple-600/8 blur-3xl" />
        </div>

        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {t.hero_badge}
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl"
            >
              {t.hero_title_1}{" "}
              <span className="gradient-text">{t.hero_title_2}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed"
            >
              {t.hero_subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Button size="lg" asChild className="glow-primary text-base px-8 py-6 font-semibold">
                <Link href="/generate">
                  {t.hero_cta}
                  <ArrowRight className="ms-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8 py-6 border-border/60 hover:border-primary/40">
                <Link href="/pricing">
                  {t.hero_cta_secondary}
                  <ChevronRight className="ms-1 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={3.5}
              className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground"
            >
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
              <span className="ms-1">{isRTL ? "مجاني للبدء · لا يلزم بطاقة ائتمان" : "Free to start · No credit card required"}</span>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={4}
              className="mt-16 grid grid-cols-3 gap-6 border-t border-border/30 pt-10"
            >
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl font-extrabold gradient-text md:text-4xl">{s.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t.features_title}</h2>
            <p className="text-muted-foreground text-lg">{t.features_subtitle}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.5}
                className="glass-card rounded-xl p-6 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ${f.color}`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 md:py-32 bg-card/30">
        <div className="container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t.how_title}</h2>
            <p className="text-muted-foreground text-lg">{t.how_subtitle}</p>
          </div>

          <div className="relative mx-auto max-w-4xl">
            {/* Connector line */}
            <div className="absolute top-12 start-[calc(16.67%+1rem)] end-[calc(16.67%+1rem)] hidden h-px bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 md:block" />

            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.5}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 ring-2 ring-primary/30 glow-primary">
                    <step.icon className="h-7 w-7 text-primary" />
                    <span className="absolute -top-2 -end-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blueprint preview */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <motion.div
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              >
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Lock className="h-3 w-3" />
                  {isRTL ? "25 قسماً شاملاً" : "25 Comprehensive Sections"}
                </div>
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                  {isRTL ? "مخطط شامل لكل مشروع" : "A Complete Blueprint for Every Project"}
                </h2>
                <p className="mb-6 text-muted-foreground leading-relaxed">
                  {isRTL
                    ? "من تحليل الأعمال إلى خارطة طريق التطوير، يغطي مخططك كل جانب من جوانب مشروعك بتفاصيل قابلة للتنفيذ."
                    : "From business analysis to development roadmap, your blueprint covers every aspect of your project with actionable details."}
                </p>
                <div className="grid grid-cols-2 gap-2 mb-8">
                  {blueprintSections.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <Button size="lg" asChild>
                  <Link href="/generate">
                    {t.hero_cta}
                    <ArrowRight className="ms-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>

              {/* Mock blueprint card */}
              <motion.div
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
                className="glass-card rounded-2xl p-6 font-mono text-xs"
              >
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/70" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                  <div className="h-3 w-3 rounded-full bg-green-500/70" />
                  <span className="ms-2 text-muted-foreground text-[10px]">blueprint.md</span>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p className="text-primary font-semibold text-sm">## 1. Business Analysis</p>
                  <p className="text-foreground/70">The platform targets freelancers who need...</p>
                  <p className="mt-3 text-primary font-semibold text-sm">## 9. Database Design</p>
                  <div className="rounded bg-muted/30 p-2 text-[10px]">
                    <p className="text-violet-400">users</p>
                    <p className="ps-2 text-muted-foreground">├─ id, name, email, role</p>
                    <p className="text-violet-400 mt-1">projects</p>
                    <p className="ps-2 text-muted-foreground">├─ id, userId, title, status</p>
                  </div>
                  <p className="mt-3 text-primary font-semibold text-sm">## 10. API Architecture</p>
                  <p className="text-foreground/70">RESTful API with JWT authentication...</p>
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {["GET /projects", "POST /invoices", "PUT /clients"].map(ep => (
                      <span key={ep} className="rounded bg-primary/15 px-1.5 py-0.5 text-primary text-[9px]">{ep}</span>
                    ))}
                  </div>
                  <p className="mt-3 text-primary font-semibold text-sm">## 15. Revenue Model</p>
                  <p className="text-foreground/70">Freemium SaaS with 3 tiers: Free, Pro ($19/mo)...</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="container">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="mx-auto max-w-2xl rounded-2xl border border-primary/20 bg-primary/5 p-10 text-center glow-primary"
          >
            <Sparkles className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h2 className="mb-3 text-3xl font-bold">{t.cta_title}</h2>
            <p className="mb-8 text-muted-foreground">{t.cta_subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild className="text-base px-8 py-6 font-semibold">
                <Link href="/generate">
                  {t.cta_button}
                  <ArrowRight className="ms-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8 py-6">
                <Link href="/pricing">
                  {isRTL ? "عرض الأسعار" : "View Pricing"}
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {isRTL ? "مجاني للبدء · لا يلزم بطاقة ائتمان" : "Free to start · No credit card required"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-10">
        <div className="container">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-start">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 ring-1 ring-primary/40">
                <Cpu className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="font-bold text-foreground">Blueprint AI</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <Link href="/generate" className="hover:text-foreground transition-colors">
                {isRTL ? "توليد مخطط" : "Generate"}
              </Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">
                {isRTL ? "الأسعار" : "Pricing"}
              </Link>
              <Link href="/dashboard" className="hover:text-foreground transition-colors">
                {isRTL ? "لوحة التحكم" : "Dashboard"}
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Blueprint AI. {t.footer_rights}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
