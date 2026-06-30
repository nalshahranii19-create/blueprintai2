import { useI18n } from "@/contexts/I18nContext";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { Cpu, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import UpgradeModal from "@/components/UpgradeModal";
import Navbar from "@/components/Navbar";

const PROJECT_TYPES_EN = [
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
];

const PROJECT_TYPES_AR = [
  "تطبيق ويب SaaS",
  "تطبيق جوال",
  "منصة تجارة إلكترونية",
  "خدمة API / خلفية",
  "منتج ذكاء اصطناعي",
  "سوق إلكتروني",
  "منصة اجتماعية",
  "أداة داخلية / لوحة تحكم",
  "إضافة متصفح",
  "أخرى",
];

type FormData = {
  projectIdea: string;
  projectType: string;
  targetAudience: string;
  coreFeatures: string;
};

export default function Generate() {
  const { t, lang, isRTL } = useI18n();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    projectIdea: "",
    projectType: "",
    targetAudience: "",
    coreFeatures: "",
  });

  const projectTypes = lang === "ar" ? PROJECT_TYPES_AR : PROJECT_TYPES_EN;

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [weakInputQuestions, setWeakInputQuestions] = useState<string[]>([]);
  const [showWeakWarning, setShowWeakWarning] = useState(false);

  const checkInputsQuery = trpc.blueprints.checkInputs.useQuery(
    {
      projectIdea: form.projectIdea,
      projectType: form.projectType,
      targetAudience: form.targetAudience,
      coreFeatures: form.coreFeatures,
      language: lang,
    },
    { enabled: step === 4 && form.coreFeatures.length >= 5 }
  );

  const generateMutation = trpc.blueprints.generate.useMutation({
    onSuccess: (data) => {
      sessionStorage.setItem("blueprint-result", JSON.stringify(data));
      navigate("/result");
    },
    onError: (err) => {
      if (err.message?.startsWith("PLAN_LIMIT_REACHED")) {
        setShowUpgradeModal(true);
      } else {
        toast.error(err.message || t.error_generic);
      }
    },
  });

  const canProceed = () => {
    if (step === 1) return form.projectIdea.trim().length >= 10;
    if (step === 2) return form.projectType.trim().length > 0;
    if (step === 3) return form.targetAudience.trim().length >= 5;
    if (step === 4) return form.coreFeatures.trim().length >= 5;
    return false;
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else handleGenerate();
  };

  const handleGenerate = (force = false) => {
    if (!force && checkInputsQuery.data?.hasWeakInputs && !showWeakWarning) {
      setWeakInputQuestions(checkInputsQuery.data.questions);
      setShowWeakWarning(true);
      return;
    }
    setShowWeakWarning(false);
    generateMutation.mutate({
      projectIdea: form.projectIdea,
      projectType: form.projectType,
      targetAudience: form.targetAudience,
      coreFeatures: form.coreFeatures,
      language: lang,
    });
  };

  const isLoading = generateMutation.isPending;

  const STEP_LABELS = isRTL
    ? ["الفكرة", "النوع", "الجمهور", "الميزات"]
    : ["Idea", "Type", "Audience", "Features"];

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      <UpgradeModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        reason="limit_reached"
      />

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 start-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/8 blur-3xl" />
      </div>

      <div className="container relative pt-24 pb-12">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 ring-2 ring-primary/30">
              <Cpu className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {isRTL ? "توليد مخطط مشروعك" : "Generate Your Blueprint"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isRTL ? "أجب على 4 أسئلة للحصول على مخطط شامل من 25 قسماً" : "Answer 4 questions to get a comprehensive 25-section blueprint"}
            </p>
          </div>

          {/* Progress */}
          {!isLoading && (
            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
                <span>{t.form_step} {step} {t.form_of} 4</span>
                <span>{Math.round((step / 4) * 100)}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
              {/* Step indicators */}
              <div className="mt-3 flex justify-between">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex flex-col items-center gap-1">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                        s < step
                          ? "bg-primary text-primary-foreground"
                          : s === step
                          ? "bg-primary/20 text-primary ring-2 ring-primary/50"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {s < step ? <CheckCircle2 className="h-4 w-4" /> : s}
                    </div>
                    <span className="hidden sm:block text-[10px] text-muted-foreground">{STEP_LABELS[s - 1]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form card */}
          <div className="glass-card rounded-2xl p-6 md:p-8">
            {isLoading ? (
              /* Loading state */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="relative mb-6">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-spin border-t-primary" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-foreground">{t.form_generating}</h2>
                <p className="text-muted-foreground text-sm max-w-xs">
                  {isRTL
                    ? "يقوم الذكاء الاصطناعي بتحليل مشروعك وتوليد مخطط شامل من 25 قسماً..."
                    : "AI is analyzing your project and generating a comprehensive 25-section blueprint..."}
                </p>
                <div className="mt-4 text-xs text-muted-foreground">
                  {isRTL ? "قد يستغرق هذا حتى 30 ثانية" : "This may take up to 30 seconds"}
                </div>
                <div className="mt-6 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-2 w-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Step 1: Project Idea */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-1">{t.form_idea_title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? "كلما كانت الفكرة أكثر تفصيلاً، كان المخطط أفضل." : "The more detailed your idea, the better the blueprint."}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idea">{t.form_idea_label}</Label>
                      <Textarea
                        id="idea"
                        value={form.projectIdea}
                        onChange={(e) => setForm({ ...form, projectIdea: e.target.value })}
                        placeholder={t.form_idea_placeholder}
                        rows={6}
                        maxLength={2000}
                        className="resize-none bg-background/50 border-border/60 focus:border-primary/50"
                        autoFocus
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {isRTL ? "الحد الأدنى 10 أحرف" : "Minimum 10 characters"}
                        </p>
                        <p className={`text-xs ${form.projectIdea.length > 1800 ? "text-amber-400" : "text-muted-foreground"}`}>
                          {form.projectIdea.length} / 2000
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Project Type */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-1">{t.form_type_title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? "اختر النوع الأقرب لمشروعك." : "Select the type that best describes your project."}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>{t.form_type_label}</Label>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {projectTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => setForm({ ...form, projectType: type })}
                            className={`rounded-xl border px-4 py-3 text-sm font-medium text-start transition-all duration-200 ${
                              form.projectType === type
                                ? "border-primary bg-primary/15 text-primary"
                                : "border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-muted/30"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Target Audience */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-1">{t.form_audience_title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? "صف جمهورك المستهدف بالتفصيل." : "Describe your target users in detail."}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="audience">{t.form_audience_label}</Label>
                      <Textarea
                        id="audience"
                        value={form.targetAudience}
                        onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                        placeholder={t.form_audience_placeholder}
                        rows={5}
                        className="resize-none bg-background/50 border-border/60 focus:border-primary/50"
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Core Features */}
                {step === 4 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-1">{t.form_features_title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? "اذكر الميزات الأساسية التي تريد بناءها." : "List the core features you want to build."}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="features">{t.form_features_label}</Label>
                      <Textarea
                        id="features"
                        value={form.coreFeatures}
                        onChange={(e) => setForm({ ...form, coreFeatures: e.target.value })}
                        placeholder={t.form_features_placeholder}
                        rows={5}
                        className="resize-none bg-background/50 border-border/60 focus:border-primary/50"
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                {/* Weak Input Warning */}
                {step === 4 && showWeakWarning && weakInputQuestions.length > 0 && (
                  <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-amber-300">
                          {isRTL ? "لتحسين جودة المخطط، يُنصح بالإجابة على:" : "To improve blueprint quality, consider answering:"}
                        </p>
                        <ul className="mt-2 space-y-1.5">
                          {weakInputQuestions.map((q, i) => (
                            <li key={i} className="text-xs text-amber-200/80 flex items-start gap-1.5">
                              <span className="text-amber-400 shrink-0">•</span>
                              {q}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowWeakWarning(false)}
                        className="text-xs text-muted-foreground"
                      >
                        {isRTL ? "تجاهل والمتابعة" : "Ignore & Continue"}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleGenerate(true)}
                        className="text-xs gap-1"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {isRTL ? "توليد الآن" : "Generate Now"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    disabled={step === 1}
                    className="gap-2"
                  >
                    {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                    {t.form_back}
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={!canProceed() || generateMutation.isPending}
                    className="gap-2 min-w-36"
                  >
                    {step === 4 ? (
                      <>
                        <Sparkles className="h-4 w-4" />
                        {t.form_generate}
                      </>
                    ) : (
                      <>
                        {t.form_next}
                        {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
