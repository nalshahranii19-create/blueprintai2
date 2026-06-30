import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  Sparkles, Copy, Check, Download, Save, Plus,
  ChevronDown, ChevronUp, LogIn, RefreshCw, Clock,
  Zap, MessageSquare, X
} from "lucide-react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import Navbar from "@/components/Navbar";
import { getLoginUrl } from "@/const";

type BlueprintData = {
  title: string;
  content: string;
  projectIdea: string;
  projectType: string;
  targetAudience: string;
  coreFeatures: string;
  language: "en" | "ar";
  industry?: string;
  budget?: string;
  teamSize?: string;
  timeline?: string;
  revenueModel?: string;
  generationTimeMs?: number;
  sectionsCount?: number;
};

// Parse blueprint content into sections with keys
function parseSections(content: string) {
  const parts = content.split(/\n---\n/);
  const sections: { key: string; title: string; content: string; emoji: string }[] = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const lines = trimmed.split('\n');
    const headingLine = lines.find(l => l.match(/^##\s+/));
    if (headingLine) {
      const title = headingLine.replace(/^##\s+/, '').trim();
      const body = lines.filter(l => !l.match(/^##\s+/)).join('\n').trim();
      // Extract emoji if present
      const emojiMatch = title.match(/^([\uD83C-\uDBFF\uDC00-\uDFFF]|[\u2600-\u27FF])\s*/);
      const emoji = emojiMatch ? emojiMatch[1] : '📋';
      // Generate a key from the title
      const key = title.toLowerCase()
        .replace(/^[\d٠-٩]+\.\s*/, '')
        .replace(/[^\w\s]/g, '')
        .trim()
        .replace(/\s+/g, '_')
        .slice(0, 30);
      sections.push({ key: key || `section_${sections.length}`, title, content: body, emoji });
    } else if (trimmed.length > 50) {
      sections.push({ key: `section_${sections.length}`, title: "Blueprint", content: trimmed, emoji: '📋' });
    }
  }

  // Fallback: parse by ## headings if no --- separators
  if (sections.length <= 1 && content.includes('\n## ')) {
    const lines = content.split('\n');
    let current: { key: string; title: string; lines: string[]; emoji: string } | null = null;
    sections.length = 0;

    for (const line of lines) {
      if (line.match(/^##\s+/)) {
        if (current) sections.push({ key: current.key, title: current.title, content: current.lines.join('\n').trim(), emoji: current.emoji });
        const title = line.replace(/^##\s+/, '').trim();
        const emojiMatch = title.match(/^([\uD83C-\uDBFF\uDC00-\uDFFF]|[\u2600-\u27FF])\s*/);
        const emoji = emojiMatch ? emojiMatch[1] : '📋';
        const key = title.toLowerCase().replace(/^[\d٠-٩]+\.\s*/, '').replace(/[^\w\s]/g, '').trim().replace(/\s+/g, '_').slice(0, 30);
        current = { key: key || `section_${sections.length}`, title, lines: [], emoji };
      } else if (current) {
        current.lines.push(line);
      }
    }
    if (current) sections.push({ key: current.key, title: current.title, content: current.lines.join('\n').trim(), emoji: current.emoji });
  }

  if (sections.length === 0) {
    sections.push({ key: 'full_blueprint', title: "Blueprint", content, emoji: '📋' });
  }

  return sections;
}

// Regenerate feedback modal
function RegenerateFeedbackModal({
  sectionTitle,
  isRTL,
  onConfirm,
  onCancel,
  isLoading,
}: {
  sectionTitle: string;
  isRTL: boolean;
  onConfirm: (feedback: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [feedback, setFeedback] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-card rounded-2xl p-6 w-full max-w-md" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              {isRTL ? "إعادة توليد القسم" : "Regenerate Section"}
            </h3>
          </div>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {isRTL
            ? `سيتم إعادة توليد قسم "${sectionTitle}" بالكامل.`
            : `Section "${sectionTitle}" will be fully regenerated.`}
        </p>
        <div className="mb-4">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            {isRTL ? "ملاحظات للتحسين (اختياري)" : "Improvement feedback (optional)"}
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={isRTL
              ? "مثال: أريد تفاصيل أكثر عن التسعير..."
              : "e.g., I want more detail about pricing strategy..."}
            className="w-full rounded-lg bg-muted/30 border border-border/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
            rows={3}
            maxLength={500}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isLoading}>
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
          <Button size="sm" onClick={() => onConfirm(feedback)} disabled={isLoading} className="gap-2">
            {isLoading ? (
              <div className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isRTL ? "إعادة التوليد" : "Regenerate"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  section,
  index,
  savedId,
  blueprintData,
  isRTL,
  onSectionRegenerated,
}: {
  section: { key: string; title: string; content: string; emoji: string };
  index: number;
  savedId: number | null;
  blueprintData: BlueprintData;
  isRTL: boolean;
  onSectionRegenerated?: (key: string, newContent: string) => void;
}) {
  const [open, setOpen] = useState(index < 3);
  const [copied, setCopied] = useState(false);
  const [showRegenModal, setShowRegenModal] = useState(false);
  const [sectionContent, setSectionContent] = useState(section.content);
  const [isRegenerated, setIsRegenerated] = useState(false);

  const regenMutation = trpc.blueprints.regenerateSection.useMutation({
    onSuccess: (res) => {
      setSectionContent(res.content.replace(/^##\s+[^\n]+\n+/, '').trim());
      setIsRegenerated(true);
      setShowRegenModal(false);
      toast.success(isRTL ? `تم إعادة توليد "${section.title}"` : `"${section.title}" regenerated!`);
      onSectionRegenerated?.(section.key, res.content);
    },
    onError: (err) => {
      setShowRegenModal(false);
      toast.error(err.message || (isRTL ? "فشل إعادة التوليد" : "Regeneration failed"));
    },
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(`## ${section.title}\n\n${sectionContent}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = (feedback: string) => {
    if (!savedId) {
      toast.info(isRTL ? "احفظ المخطط أولاً لإعادة توليد الأقسام" : "Save the blueprint first to regenerate sections");
      setShowRegenModal(false);
      return;
    }
    regenMutation.mutate({
      blueprintId: savedId,
      sectionKey: section.key,
      projectIdea: blueprintData.projectIdea,
      projectType: blueprintData.projectType,
      targetAudience: blueprintData.targetAudience,
      coreFeatures: blueprintData.coreFeatures,
      language: blueprintData.language,
      industry: blueprintData.industry,
      budget: blueprintData.budget,
      teamSize: blueprintData.teamSize,
      timeline: blueprintData.timeline,
      revenueModel: blueprintData.revenueModel,
      feedback: feedback || undefined,
    });
  };

  return (
    <>
      {showRegenModal && (
        <RegenerateFeedbackModal
          sectionTitle={section.title}
          isRTL={isRTL}
          onConfirm={handleRegenerate}
          onCancel={() => setShowRegenModal(false)}
          isLoading={regenMutation.isPending}
        />
      )}
      <div className={`glass-card rounded-xl overflow-hidden transition-all ${isRegenerated ? 'ring-1 ring-primary/40' : ''}`}>
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between px-5 py-4 text-start hover:bg-muted/20 transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-base shrink-0">{section.emoji}</span>
            <span className="font-semibold text-foreground text-sm truncate">{section.title}</span>
            {isRegenerated && (
              <span className="shrink-0 text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                {isRTL ? "محدّث" : "Updated"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ms-3">
            {open && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  title={isRTL ? "نسخ" : "Copy"}
                >
                  {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowRegenModal(true); }}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  title={isRTL ? "إعادة توليد" : "Regenerate"}
                >
                  <RefreshCw className="h-3 w-3" />
                </button>
              </>
            )}
            {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </div>
        </button>
        {open && (
          <div className="border-t border-border/30 px-5 py-4">
            <div className="prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground prose-code:text-primary prose-strong:text-foreground">
              <Streamdown>{sectionContent}</Streamdown>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function BlueprintResult() {
  const { t, isRTL } = useI18n();
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [data, setData] = useState<BlueprintData | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [expandAll, setExpandAll] = useState(false);

  const saveMutation = trpc.blueprints.save.useMutation({
    onSuccess: (res) => {
      setSavedId(res.id);
      setSaving(false);
      toast.success(t.result_saved);
    },
    onError: (err) => {
      setSaving(false);
      toast.error(err.message || t.error_generic);
    },
  });

  useEffect(() => {
    const raw = sessionStorage.getItem("blueprint-result");
    if (!raw) { navigate("/generate"); return; }
    try { setData(JSON.parse(raw)); } catch { navigate("/generate"); }
  }, [navigate]);

  if (!data) return null;

  const sections = parseSections(data.content);

  const handleSave = () => {
    if (!isAuthenticated) { toast.info(t.signin_to_save); return; }
    setSaving(true);
    saveMutation.mutate({
      title: data.title,
      projectIdea: data.projectIdea,
      projectType: data.projectType,
      targetAudience: data.targetAudience,
      coreFeatures: data.coreFeatures,
      content: data.content,
      language: data.language,
      industry: data.industry,
      budget: data.budget,
      teamSize: data.teamSize,
      timeline: data.timeline,
      revenueModel: data.revenueModel,
      generationTimeMs: data.generationTimeMs,
    });
  };

  const handleExport = () => {
    const blob = new Blob([data.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.title.slice(0, 50).replace(/[^a-z0-9]/gi, '-')}-blueprint.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(isRTL ? "تم تصدير الملف!" : "File exported!");
  };

  const formatTime = (ms?: number) => {
    if (!ms) return null;
    if (ms < 60000) return `${Math.round(ms / 1000)}s`;
    return `${Math.round(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      <div className="container pt-24 pb-10">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary">{t.result_title}</span>
            </div>
            <h1 className="mb-3 text-2xl font-bold text-foreground md:text-3xl line-clamp-2">{data.title}</h1>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-muted/50 px-2.5 py-1">{data.projectType}</span>
              <span className="rounded-full bg-muted/50 px-2.5 py-1">
                {sections.length} {isRTL ? "قسم" : "sections"}
              </span>
              {data.generationTimeMs && (
                <span className="rounded-full bg-muted/50 px-2.5 py-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(data.generationTimeMs)}
                </span>
              )}
              {data.industry && (
                <span className="rounded-full bg-primary/10 text-primary px-2.5 py-1">{data.industry}</span>
              )}
            </div>
          </div>

          {/* AI Info Banner */}
          <div className="mb-6 rounded-xl bg-primary/5 border border-primary/15 px-4 py-3 flex items-start gap-3">
            <Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isRTL
                ? `تم توليد هذا المخطط بواسطة مستشار الأعمال الذكي — ${sections.length} قسماً مخصصاً لمشروعك. يمكنك إعادة توليد أي قسم بشكل مستقل بالنقر على أيقونة ↻ داخل القسم.`
                : `This blueprint was generated by the AI Business Consultant — ${sections.length} sections fully personalized for your project. You can regenerate any section independently by clicking the ↻ icon inside it.`}
            </p>
          </div>

          {/* Action buttons */}
          <div className="mb-6 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              {t.result_export}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandAll(!expandAll)}
              className="gap-2"
            >
              {expandAll ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {isRTL ? (expandAll ? "طي الكل" : "توسيع الكل") : (expandAll ? "Collapse All" : "Expand All")}
            </Button>

            {!isAuthenticated ? (
              <Button size="sm" variant="outline" className="gap-2" asChild>
                <a href={getLoginUrl()}>
                  <LogIn className="h-4 w-4" />
                  {t.signin_required}
                </a>
              </Button>
            ) : savedId ? (
              <Button size="sm" variant="outline" className="gap-2 text-green-400 border-green-400/30" asChild>
                <a href={`/dashboard/${savedId}`}>
                  <Check className="h-4 w-4" />
                  {t.result_saved}
                </a>
              </Button>
            ) : (
              <Button size="sm" onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? (
                  <><div className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />{t.result_saving}</>
                ) : (
                  <><Save className="h-4 w-4" />{t.result_save}</>
                )}
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={() => { sessionStorage.removeItem("blueprint-result"); navigate("/generate"); }}
              className="gap-2 ms-auto"
            >
              <Plus className="h-4 w-4" />
              {t.result_new}
            </Button>
          </div>

          {/* Regenerate hint */}
          {savedId && (
            <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
              <span>
                {isRTL
                  ? "انقر على أيقونة ↻ في أي قسم لإعادة توليده مع ملاحظاتك"
                  : "Click the ↻ icon in any section to regenerate it with your feedback"}
              </span>
            </div>
          )}

          {/* Sections */}
          <div className="space-y-3">
            {sections.map((section, i) => (
              <SectionCard
                key={section.key + i}
                section={section}
                index={expandAll ? -1 : i}
                savedId={savedId}
                blueprintData={data}
                isRTL={isRTL}
              />
            ))}
          </div>

          {/* Bottom actions */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              {t.result_export}
            </Button>
            <Button
              onClick={() => { sessionStorage.removeItem("blueprint-result"); navigate("/generate"); }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {t.result_new}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
