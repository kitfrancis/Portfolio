"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { Eye, TrendingUp, Calendar, BarChart3, X, ChevronDown, ChevronUp } from "lucide-react";

type ViewStats = {
  total: number;
  today: number;
  last7: number;
  last30: number;
  pages: { path: string; views: number }[];
  daily: { date: string; count: number }[];
};

export default function AdminStats() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<ViewStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/views");
      if (res.ok) setStats(await res.json());
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session && open) fetchStats();
  }, [session, open, fetchStats]);

  if (!session) return null;

  // Floating trigger button
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border bg-card px-4 py-2.5 font-mono text-xs shadow-lg transition hover:shadow-xl hover:border-foreground"
        aria-label="Open site analytics"
      >
        <BarChart3 className="h-4 w-4" />
        Analytics
      </button>
    );
  }

  // Max value for sparkline chart
  const maxDaily = stats ? Math.max(...stats.daily.map((d) => d.count), 1) : 1;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 max-h-[80vh] overflow-y-auto rounded-2xl border bg-card shadow-2xl">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card px-4 py-3">
        <h3 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
          <BarChart3 className="h-4 w-4" />
          Site Analytics
        </h3>
        <button
          onClick={() => setOpen(false)}
          className="rounded-md p-1 transition hover:bg-muted"
          aria-label="Close analytics"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4">
        {loading && !stats ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted border-t-foreground" />
          </div>
        ) : stats ? (
          <div className="space-y-4">
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-2">
              <StatCard icon={<Eye className="h-3.5 w-3.5" />} label="Total" value={stats.total} />
              <StatCard icon={<TrendingUp className="h-3.5 w-3.5" />} label="Today" value={stats.today} accent />
              <StatCard icon={<Calendar className="h-3.5 w-3.5" />} label="Last 7d" value={stats.last7} />
              <StatCard icon={<Calendar className="h-3.5 w-3.5" />} label="Last 30d" value={stats.last30} />
            </div>

            {/* Sparkline chart (last 30 days) */}
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Daily views (30 days)
              </p>
              <div className="flex items-end gap-0.5 rounded-lg border bg-background/50 p-3" style={{ height: 80 }}>
                {stats.daily.map((d) => (
                  <div
                    key={d.date}
                    className="flex-1 rounded-sm bg-emerald-500/70 transition-all hover:bg-emerald-400"
                    style={{
                      height: `${Math.max((d.count / maxDaily) * 100, 4)}%`,
                      minHeight: 2,
                    }}
                    title={`${d.date}: ${d.count} views`}
                  />
                ))}
              </div>
            </div>

            {/* Top pages */}
            <div>
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex w-full items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition hover:text-foreground"
              >
                Top pages
                {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
              {expanded && (
                <ul className="mt-2 space-y-1">
                  {stats.pages.map((p) => (
                    <li
                      key={p.path}
                      className="flex items-center justify-between rounded-md border px-3 py-1.5 text-xs"
                    >
                      <span className="truncate font-mono text-muted-foreground">{p.path}</span>
                      <span className="ml-2 shrink-0 font-mono font-bold">{p.views}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Refresh */}
            <button
              onClick={fetchStats}
              disabled={loading}
              className="w-full rounded-lg border py-1.5 font-mono text-xs text-muted-foreground transition hover:border-foreground hover:text-foreground disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-muted-foreground">Failed to load stats.</p>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border bg-background/50 p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="font-mono text-[11px] uppercase tracking-wider">{label}</span>
      </div>
      <p className={`mt-1 text-xl font-bold tabular-nums ${accent ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
        {value.toLocaleString()}
      </p>
    </div>
  );
}

