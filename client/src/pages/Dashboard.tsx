import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Plus, Trash2, Eye, Cpu, Calendar, Tag,
  AlertTriangle, Loader2, Crown, Zap, Settings
} from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import UsageBanner from "@/components/UsageBanner";
import { PLANS, type PlanId } from "../../../shared/plans";
import Navbar from "@/components/Navbar";

function formatDate(date: Date, isRTL: boolean) {
  return new Date(date).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function Dashboard() {
  const { t, isRTL } = useI18n();
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: blueprints, isLoading, refetch } = trpc.blueprints.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: myPlan } = trpc.plans.myPlan.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const deleteMutation = trpc.blueprints.delete.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم حذف المخطط" : "Blueprint deleted");
      refetch();
      setDeleteId(null);
    },
    onError: (err) => {
      toast.error(err.message || t.error_generic);
      setDeleteId(null);
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
        <Navbar />
        <div className="container pt-24 pb-20">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-2 ring-primary/20">
              <Cpu className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-3 text-2xl font-bold">{t.signin_required}</h1>
            <p className="mb-8 text-muted-foreground">{t.signin_to_save}</p>
            <Button asChild size="lg">
              <a href={getLoginUrl()}>{t.nav_signin}</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 start-1/4 h-80 w-80 rounded-full bg-indigo-600/5 blur-3xl" />
      </div>

      <div className="container relative pt-24 pb-10">
        {/* Usage Banner */}
        <UsageBanner />

        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">{t.dash_title}</h1>
            </div>
            <p className="text-muted-foreground text-sm">{t.dash_subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link href="/settings">
                <Settings className="h-3.5 w-3.5" />
                {isRTL ? "الإعدادات" : "Settings"}
              </Link>
            </Button>
            <Button asChild className="gap-2 shrink-0">
              <Link href="/generate">
                <Plus className="h-4 w-4" />
                {t.dash_new}
              </Link>
            </Button>
          </div>
        </div>

        {/* Plan summary card */}
        {myPlan && (
          <div className="mb-6 flex items-center justify-between p-4 rounded-xl border border-border bg-card/50">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                myPlan.plan === 'business' ? 'bg-violet-500/10 text-violet-400' :
                myPlan.plan === 'pro' ? 'bg-indigo-500/10 text-indigo-400' :
                'bg-slate-500/10 text-slate-400'
              }`}>
                {myPlan.plan === 'free' ? <Zap className="w-4 h-4" /> : <Crown className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {isRTL ? PLANS[myPlan.plan as PlanId].nameAr : PLANS[myPlan.plan as PlanId].name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {myPlan.unlimited
                    ? (isRTL ? 'مخططات غير محدودة' : 'Unlimited blueprints')
                    : (isRTL
                      ? `${myPlan.usedThisMonth} / ${myPlan.limit} مخططات هذا الشهر`
                      : `${myPlan.usedThisMonth} / ${myPlan.limit} blueprints this month`)}
                </p>
              </div>
            </div>
            {myPlan.plan !== 'business' && (
              <Button asChild size="sm" variant="outline" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
                <Link href="/pricing">
                  {isRTL ? 'ترقية' : 'Upgrade'}
                </Link>
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : !blueprints || blueprints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/30 ring-2 ring-border/30">
              <Cpu className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">{t.dash_empty}</h2>
            <p className="mb-8 text-muted-foreground">{t.dash_empty_sub}</p>
            <Button asChild className="gap-2">
              <Link href="/generate">
                <Plus className="h-4 w-4" />
                {t.dash_new}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {blueprints.map((bp) => (
              <div
                key={bp.id}
                className="glass-card rounded-xl p-5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
              >
                {/* Card header */}
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Cpu className="h-4 w-4 text-primary" />
                  </div>
                  <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                    bp.language === "ar"
                      ? "bg-violet-500/15 text-violet-400"
                      : "bg-indigo-500/15 text-indigo-400"
                  }`}>
                    {bp.language === "ar" ? "عربي" : "EN"}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-2 font-semibold text-foreground line-clamp-2 text-sm leading-snug flex-1">
                  {bp.title}
                </h3>

                {/* Meta */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Tag className="h-3 w-3 shrink-0" />
                    <span className="truncate">{bp.projectType}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span>{formatDate(bp.createdAt, isRTL)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" asChild className="flex-1 gap-1.5 text-xs">
                    <Link href={`/dashboard/${bp.id}`}>
                      <Eye className="h-3.5 w-3.5" />
                      {t.dash_view}
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteId(bp.id)}
                    className="gap-1.5 text-xs text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {t.dash_delete}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent dir={isRTL ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {t.dash_delete}
            </AlertDialogTitle>
            <AlertDialogDescription>{t.dash_delete_confirm}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.dash_delete_no}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t.dash_delete_yes
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
