import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "ar";

type Translations = {
  // Navbar
  nav_home: string;
  nav_generate: string;
  nav_dashboard: string;
  nav_signin: string;
  nav_signout: string;
  nav_my_blueprints: string;

  // Hero
  hero_badge: string;
  hero_title_1: string;
  hero_title_2: string;
  hero_subtitle: string;
  hero_cta: string;
  hero_cta_secondary: string;
  hero_stats_blueprints: string;
  hero_stats_sections: string;
  hero_stats_time: string;

  // Features
  features_title: string;
  features_subtitle: string;
  feature_1_title: string;
  feature_1_desc: string;
  feature_2_title: string;
  feature_2_desc: string;
  feature_3_title: string;
  feature_3_desc: string;
  feature_4_title: string;
  feature_4_desc: string;
  feature_5_title: string;
  feature_5_desc: string;
  feature_6_title: string;
  feature_6_desc: string;

  // How it works
  how_title: string;
  how_subtitle: string;
  step_1_title: string;
  step_1_desc: string;
  step_2_title: string;
  step_2_desc: string;
  step_3_title: string;
  step_3_desc: string;

  // CTA
  cta_title: string;
  cta_subtitle: string;
  cta_button: string;

  // Footer
  footer_tagline: string;
  footer_rights: string;

  // Generate form
  form_step: string;
  form_of: string;
  form_idea_title: string;
  form_idea_label: string;
  form_idea_placeholder: string;
  form_type_title: string;
  form_type_label: string;
  form_audience_title: string;
  form_audience_label: string;
  form_audience_placeholder: string;
  form_features_title: string;
  form_features_label: string;
  form_features_placeholder: string;
  form_next: string;
  form_back: string;
  form_generate: string;
  form_generating: string;

  // Blueprint result
  result_title: string;
  result_copy: string;
  result_copied: string;
  result_save: string;
  result_saved: string;
  result_export: string;
  result_new: string;
  result_saving: string;

  // Dashboard
  dash_title: string;
  dash_subtitle: string;
  dash_empty: string;
  dash_empty_sub: string;
  dash_new: string;
  dash_delete: string;
  dash_delete_confirm: string;
  dash_delete_yes: string;
  dash_delete_no: string;
  dash_view: string;
  dash_created: string;

  // Common
  loading: string;
  error_generic: string;
  signin_required: string;
  signin_to_save: string;
};

const en: Translations = {
  nav_home: "Home",
  nav_generate: "Generate",
  nav_dashboard: "Dashboard",
  nav_signin: "Sign In",
  nav_signout: "Sign Out",
  nav_my_blueprints: "My Blueprints",

  hero_badge: "AI-Powered Project Planning",
  hero_title_1: "Generate Your",
  hero_title_2: "Project Blueprint",
  hero_subtitle: "Transform your idea into a comprehensive, production-ready blueprint in seconds. 25 detailed sections covering architecture, database design, API specs, security, and a complete development roadmap.",
  hero_cta: "Generate Your Blueprint",
  hero_cta_secondary: "See Example",
  hero_stats_blueprints: "Blueprints Generated",
  hero_stats_sections: "Sections Per Blueprint",
  hero_stats_time: "Generation Time",

  features_title: "Everything You Need to Build",
  features_subtitle: "From idea to production-ready plan in one click. No more guessing, no more missing pieces.",
  feature_1_title: "25 Detailed Sections",
  feature_1_desc: "Business analysis, tech stack, database design, API architecture, security, deployment, and more.",
  feature_2_title: "AI-Powered Intelligence",
  feature_2_desc: "Powered by state-of-the-art LLMs to generate expert-level technical blueprints tailored to your project.",
  feature_3_title: "Bilingual Support",
  feature_3_desc: "Generate blueprints in English or Arabic with full RTL support and professional terminology.",
  feature_4_title: "Export & Save",
  feature_4_desc: "Export your blueprint as Markdown, save it to your account, and access it anytime from your dashboard.",
  feature_5_title: "Production Ready",
  feature_5_desc: "Every blueprint is detailed enough for another AI or developer to build the project without asking questions.",
  feature_6_title: "Complete Roadmap",
  feature_6_desc: "Get a phased development roadmap, testing strategy, scalability plan, and revenue maximization tips.",

  how_title: "How It Works",
  how_subtitle: "Three simple steps to your complete project blueprint.",
  step_1_title: "Describe Your Idea",
  step_1_desc: "Fill in 4 quick fields: your project idea, type, target audience, and core features.",
  step_2_title: "AI Generates Blueprint",
  step_2_desc: "Our AI analyzes your input and generates a comprehensive 25-section blueprint in seconds.",
  step_3_title: "Save & Export",
  step_3_desc: "Save your blueprint to your account, export as Markdown, and start building.",

  cta_title: "Ready to Plan Your Next Project?",
  cta_subtitle: "Join thousands of founders and developers who use Blueprint AI to plan their projects.",
  cta_button: "Start Generating — It's Free",

  footer_tagline: "AI-powered project blueprints for founders and developers.",
  footer_rights: "All rights reserved.",

  form_step: "Step",
  form_of: "of",
  form_idea_title: "What's Your Project Idea?",
  form_idea_label: "Project Idea",
  form_idea_placeholder: "Describe your project idea in detail. E.g., A SaaS platform that helps freelancers manage their clients, invoices, and projects in one place.",
  form_type_title: "What Type of Project?",
  form_type_label: "Project Type",
  form_audience_title: "Who Is Your Target Audience?",
  form_audience_label: "Target Audience",
  form_audience_placeholder: "E.g., Freelancers, small business owners, and independent contractors aged 25-45 who are tech-savvy.",
  form_features_title: "What Are the Core Features?",
  form_features_label: "Core Features",
  form_features_placeholder: "E.g., Client management, invoice generation, project tracking, time tracking, payment integration, reporting dashboard.",
  form_next: "Next",
  form_back: "Back",
  form_generate: "Generate Blueprint",
  form_generating: "Generating your blueprint...",

  result_title: "Your Blueprint is Ready",
  result_copy: "Copy",
  result_copied: "Copied!",
  result_save: "Save to Account",
  result_saved: "Saved!",
  result_export: "Export Markdown",
  result_new: "New Blueprint",
  result_saving: "Saving...",

  dash_title: "My Blueprints",
  dash_subtitle: "All your saved project blueprints in one place.",
  dash_empty: "No blueprints yet",
  dash_empty_sub: "Generate your first blueprint to get started.",
  dash_new: "New Blueprint",
  dash_delete: "Delete",
  dash_delete_confirm: "Are you sure you want to delete this blueprint? This action cannot be undone.",
  dash_delete_yes: "Delete",
  dash_delete_no: "Cancel",
  dash_view: "View",
  dash_created: "Created",

  loading: "Loading...",
  error_generic: "Something went wrong. Please try again.",
  signin_required: "Sign in to save your blueprint",
  signin_to_save: "Sign in to save this blueprint to your account.",
};

const ar: Translations = {
  nav_home: "الرئيسية",
  nav_generate: "توليد مخطط",
  nav_dashboard: "لوحة التحكم",
  nav_signin: "تسجيل الدخول",
  nav_signout: "تسجيل الخروج",
  nav_my_blueprints: "مخططاتي",

  hero_badge: "تخطيط المشاريع بالذكاء الاصطناعي",
  hero_title_1: "ولّد مخطط",
  hero_title_2: "مشروعك الاحترافي",
  hero_subtitle: "حوّل فكرتك إلى مخطط شامل وجاهز للإنتاج في ثوانٍ. 25 قسماً تفصيلياً يغطي البنية المعمارية، قاعدة البيانات، واجهات API، الأمان، وخارطة طريق التطوير الكاملة.",
  hero_cta: "ولّد مخططك الآن",
  hero_cta_secondary: "شاهد مثالاً",
  hero_stats_blueprints: "مخطط مُولَّد",
  hero_stats_sections: "قسماً لكل مخطط",
  hero_stats_time: "وقت التوليد",

  features_title: "كل ما تحتاجه للبناء",
  features_subtitle: "من الفكرة إلى خطة جاهزة للإنتاج بنقرة واحدة. لا تخمين، لا قطع ناقصة.",
  feature_1_title: "25 قسماً تفصيلياً",
  feature_1_desc: "تحليل الأعمال، التقنيات، قاعدة البيانات، بنية API، الأمان، النشر، والمزيد.",
  feature_2_title: "ذكاء اصطناعي متقدم",
  feature_2_desc: "مدعوم بأحدث نماذج اللغة لتوليد مخططات تقنية على مستوى الخبراء مخصصة لمشروعك.",
  feature_3_title: "دعم ثنائي اللغة",
  feature_3_desc: "ولّد المخططات بالعربية أو الإنجليزية مع دعم كامل للاتجاه من اليمين لليسار.",
  feature_4_title: "تصدير وحفظ",
  feature_4_desc: "صدّر مخططك كـ Markdown، احفظه في حسابك، وادخل إليه في أي وقت من لوحة التحكم.",
  feature_5_title: "جاهز للإنتاج",
  feature_5_desc: "كل مخطط مفصّل بما يكفي لذكاء اصطناعي آخر أو مطور لبناء المشروع دون أسئلة إضافية.",
  feature_6_title: "خارطة طريق كاملة",
  feature_6_desc: "احصل على خارطة طريق تطوير مرحلية، استراتيجية اختبار، خطة توسع، ونصائح تعظيم الإيرادات.",

  how_title: "كيف يعمل",
  how_subtitle: "ثلاث خطوات بسيطة للحصول على مخطط مشروعك الكامل.",
  step_1_title: "صف فكرتك",
  step_1_desc: "أكمل 4 حقول سريعة: فكرة مشروعك، نوعه، جمهورك المستهدف، والميزات الأساسية.",
  step_2_title: "الذكاء الاصطناعي يولّد المخطط",
  step_2_desc: "يحلل الذكاء الاصطناعي مدخلاتك ويولّد مخططاً شاملاً من 25 قسماً في ثوانٍ.",
  step_3_title: "احفظ وصدّر",
  step_3_desc: "احفظ مخططك في حسابك، صدّره كـ Markdown، وابدأ البناء.",

  cta_title: "هل أنت مستعد لتخطيط مشروعك القادم؟",
  cta_subtitle: "انضم إلى آلاف المؤسسين والمطورين الذين يستخدمون Blueprint AI لتخطيط مشاريعهم.",
  cta_button: "ابدأ التوليد — مجاناً",

  footer_tagline: "مخططات مشاريع بالذكاء الاصطناعي للمؤسسين والمطورين.",
  footer_rights: "جميع الحقوق محفوظة.",

  form_step: "الخطوة",
  form_of: "من",
  form_idea_title: "ما هي فكرة مشروعك؟",
  form_idea_label: "فكرة المشروع",
  form_idea_placeholder: "صف فكرة مشروعك بالتفصيل. مثال: منصة SaaS تساعد المستقلين على إدارة عملائهم وفواتيرهم ومشاريعهم في مكان واحد.",
  form_type_title: "ما نوع المشروع؟",
  form_type_label: "نوع المشروع",
  form_audience_title: "من هو جمهورك المستهدف؟",
  form_audience_label: "الجمهور المستهدف",
  form_audience_placeholder: "مثال: المستقلون وأصحاب الأعمال الصغيرة والمقاولون المستقلون من الفئة العمرية 25-45 سنة.",
  form_features_title: "ما هي الميزات الأساسية؟",
  form_features_label: "الميزات الأساسية",
  form_features_placeholder: "مثال: إدارة العملاء، إنشاء الفواتير، تتبع المشاريع، تتبع الوقت، تكامل الدفع، لوحة التقارير.",
  form_next: "التالي",
  form_back: "السابق",
  form_generate: "توليد المخطط",
  form_generating: "جاري توليد مخططك...",

  result_title: "مخططك جاهز",
  result_copy: "نسخ",
  result_copied: "تم النسخ!",
  result_save: "حفظ في الحساب",
  result_saved: "تم الحفظ!",
  result_export: "تصدير Markdown",
  result_new: "مخطط جديد",
  result_saving: "جاري الحفظ...",

  dash_title: "مخططاتي",
  dash_subtitle: "جميع مخططات مشاريعك المحفوظة في مكان واحد.",
  dash_empty: "لا توجد مخططات بعد",
  dash_empty_sub: "ولّد مخططك الأول للبدء.",
  dash_new: "مخطط جديد",
  dash_delete: "حذف",
  dash_delete_confirm: "هل أنت متأكد من حذف هذا المخطط؟ لا يمكن التراجع عن هذا الإجراء.",
  dash_delete_yes: "حذف",
  dash_delete_no: "إلغاء",
  dash_view: "عرض",
  dash_created: "تاريخ الإنشاء",

  loading: "جاري التحميل...",
  error_generic: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
  signin_required: "سجّل الدخول لحفظ مخططك",
  signin_to_save: "سجّل الدخول لحفظ هذا المخطط في حسابك.",
};

const translations: Record<Language, Translations> = { en, ar };

type I18nContextType = {
  lang: Language;
  setLang: (l: Language) => void;
  t: Translations;
  isRTL: boolean;
};

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: en,
  isRTL: false,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("blueprint-lang");
      if (saved === "ar" || saved === "en") return saved;
    } catch {}
    return "en";
  });

  const setLang = (l: Language) => {
    setLangState(l);
    try { localStorage.setItem("blueprint-lang", l); } catch {}
  };

  const isRTL = lang === "ar";

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang], isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
