import { useI18n } from "@/contexts/I18nContext";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link, useParams } from "wouter";
import {
  ArrowLeft, ArrowRight, Download, Sparkles,
  ChevronDown, ChevronUp, Copy, Check, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import Navbar from "@/components/Navbar";

function parseSections(content: string) {
  const sections: { title: string; content: string; emoji: string }[] = [];

  // Try --- separator first
  const parts = content.split(/\n---\n/);
  if (parts.length > 1) {
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const lines = trimmed.split('\n');
      const headingLine = lines.find(l => l.match(/^##\s+/));
      if (headingLine) {
        const title = headingLine.replace(/^##\s+/, '').trim();
        const body = lines.filter(l => !l.match(/^##\s+/)).join('\n').trim();
        const emojiMatch = title.match(/^([\uD83C-\uDBFF\uDC00-\uDFFF]|[\u2600-\u27FF])\s*/);
        const emoji = emojiMatch ? emojiMatch[1] : '📋';
        sections.push({ title, content: body, emoji });
      }
    }
    if (sections.length > 1) return sections;
  }

  // Fallback: parse by ## headings
  const lines = content.split('\n');
  let current: { title: string; lines: string[]; emoji: string } | null = null;
  for (const line of lines) {
    if (line.match(/^##\s+/)) {
      if (current) sections.push({ title: current.title, content: current.lines.join('\n').trim(), emoji: current.emoji });
      const title = line.replace(/^##\s+/, '').trim();
      const emojiMatch = title.match(/^([\uD83C-\uDBFF\uDC00-\uDFFF]|[\u2600-\u27FF])\s*/);
      const emoji = emojiMatch ? emojiMatch[1] : '📋';
      current = { title, lines: [], emoji };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push({ title: current.title, content: current.lines.join('\n').trim(), emoji: current.emoji });

  if (sections.length === 0) sections.push({ title: "Blueprint", content, emoji: '📋' });
  return sections;
}

function SectionCard({
  section,
  index,
  forceOpen,
}: {
  section: { title: string; content: string; emoji: string };
  index: number;
  forceOpen?: boolean;
}) {
  const [open, setOpen] = useState(index < 3);
  const [copied, setCopied] = useState(false);

  const isOpen = forceOpen !== undefined ? forceOpen : open;

  const handleCopy = () => {
    navigator.clipboard.writeText(`## ${section.title}\n\n${section.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-start hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-base shrink-0">{section.emoji}</span>
          <span className="font-semibold text-foreground text-sm truncate">{section.title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0 ms-3">
          {isOpen && (
            <button
              onClick={(e) => { e.stopPropagation(); handleCopy(); }}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              title="Copy"
            >
              {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
            </button>
          )}
          {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>
      {isOpen && (
        <div className="border-t border-border/30 px-5 py-4">
          <div className="prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground prose-code:text-primary prose-strong:text-foreground">
            <Streamdown>{section.content}</Streamdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BlueprintDetail() {
  const { t, isRTL } = useI18n();
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id ?? "0");
  const [expandAll, setExpandAll] = useState<boolean | undefined>(undefined);

  const { data: bp, isLoading, error } = trpc.blueprints.get.useQuery({ id }, { enabled: !!id });

  const handleExport = () => {
    if (!bp) return;
    const blob = new Blob([bp.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${bp.title.slice(0, 50).replace(/[^a-z0-9]/gi, '-')}-blueprint.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(isRTL ? "تم تصدير الملف!" : "File exported!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir={isRTL ? "rtl" : "ltr"}>
        <Navbar />
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !bp) {
    return (
      <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
        <Navbar />
        <div className="container pt-24 pb-20 text-center">
          <p className="text-muted-foreground mb-4">{t.error_generic}</p>
          <Button asChild variant="outline">
            <Link href="/dashboard">{isRTL ? "العودة للوحة التحكم" : "Back to Dashboard"}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const sections = parseSections(bp.content);

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      <div className="container pt-24 pb-10">
        <div className="mx-auto max-w-4xl">
          {/* Back */}
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground hover:text-foreground -ms-2">
              <Link href="/dashboard">
                {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                {isRTL ? "العودة للوحة التحكم" : "Back to Dashboard"}
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary">{t.result_title}</span>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">{bp.title}</h1>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-muted/50 px-2.5 py-1">{bp.projectType}</span>
              <span className="rounded-full bg-muted/50 px-2.5 py-1">
                {sections.length} {isRTL ? "قسم" : "sections"}
              </span>
              <span className="rounded-full bg-muted/50 px-2.5 py-1">
                {new Date(bp.createdAt).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
                  year: "numeric", month: "short", day: "numeric"
                })}
              </span>
              {bp.language && (
                <span className={`rounded-full px-2.5 py-1 font-medium ${
                  bp.language === "ar"
                    ? "bg-violet-500/15 text-violet-400"
                    : "bg-indigo-500/15 text-indigo-400"
                }`}>
                  {bp.language === "ar" ? "عربي" : "EN"}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mb-6 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              {t.result_export}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandAll(prev => prev === true ? false : true)}
              className="gap-2"
            >
              {expandAll ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {isRTL ? (expandAll ? "طي الكل" : "توسيع الكل") : (expandAll ? "Collapse All" : "Expand All")}
            </Button>
          </div>

          {/* Sections */}
          <div className="space-y-3">
            {sections.map((section, i) => (
              <SectionCard
                key={i}
                section={section}
                index={i}
                forceOpen={expandAll}
              />
            ))}
          </div>

          {/* Bottom actions */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              {t.result_export}
            </Button>
            <Button asChild className="gap-2">
              <Link href="/generate">
                {isRTL ? "توليد مخطط جديد" : "Generate New Blueprint"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
