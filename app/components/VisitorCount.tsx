"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

export default function VisitorCount() {
  const { data: session } = useSession();
  const [counts, setCounts] = useState<{ total: number; today: number } | null>(null);

  useEffect(() => {
    if (!session) {
      setCounts(null);
      return;
    }
    let cancelled = false;
    fetch("/api/views/count")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setCounts(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [session]);

  if (!session || !counts) return null;

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 font-mono text-xs"
      title="Daily unique visitors"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      <span className="text-foreground">{counts.total.toLocaleString()}</span>
      <span className="text-muted-foreground">visits</span>
      <span className="text-muted-foreground">/</span>
      <span className="text-foreground">{counts.today.toLocaleString()}</span>
      <span className="text-muted-foreground">today</span>
    </div>
  );
} 