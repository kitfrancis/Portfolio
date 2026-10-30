"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getVisitorId(): string | null {
  try {
    let id = localStorage.getItem("vid");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("vid", id);
    }
    return id;
  } catch {
    return null; // storage blocked
  }
}

export default function ViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    // count each page once per tab session (refreshes and Strict Mode don't re-count)
    try {
      const key = `viewed:${pathname}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {}

    const body = JSON.stringify({ path: pathname, visitorId: getVisitorId() });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/views", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/views", {
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}