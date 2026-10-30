"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Check, ArrowUpRight } from "lucide-react";

// TODO: replace with your real profile URLs
const EMAIL = "kfsbesa@antiquespride.edu.ph";
const SOCIALS = [
  { label: "GitHub", handle: "@kitfrancis", href: "https://github.com/kitfrancis" },
  { label: "LinkedIn", handle: "kitfrancis-besa", href: "https://www.linkedin.com/in/kitfrancis-besa-263a963b8" },
  { label: "Facebook", handle: "Kit Francis Sabrine Besa", href: "https://www.facebook.com/kitbesa" },
  { label: "Instagram", handle: "Kit Besa", href: "https:/instagram.com/kititeee" },
  
];

const rowClass =
  "group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b px-2 py-6 text-left transition hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 sm:grid-cols-[3rem_1fr_auto] sm:px-4";

export default function ContactPage() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      toast.success("Email copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn’t copy. Select the address and copy it manually.");
    }
  };

  return (
    <main className="min-h-screen">
      <div className="mt-1 lg:ml-64 lg:mt-8 lg:px-5">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Contact</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tighter sm:text-6xl">
            Let’s connect.
            <span className="block text-muted-foreground">Find me here.</span>
          </h1>

          <div className="mt-12 border-t border-t-cyan-500">
            {/* Email: copies the address */}
            <button onClick={copyEmail} className={rowClass} aria-label="Copy email address">
              <span className="font-mono text-xs text-muted-foreground">01</span>
              <span>
                <span className="block text-xl font-bold tracking-tight sm:text-2xl">Email</span>
                <span className="block break-all font-mono text-xs text-muted-foreground">{EMAIL}</span>
              </span>
              <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground transition group-hover:text-cyan-500">
                {copied ? "Copied" : "Copy"}
                {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
              </span>
            </button>

            {/* Social links */}
            {SOCIALS.map((s, i) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={rowClass}>
                <span className="font-mono text-xs text-muted-foreground">{String(i + 2).padStart(2, "0")}</span>
                <span>
                  <span className="block text-xl font-bold tracking-tight sm:text-2xl">{s.label}</span>
                  <span className="block font-mono text-xs text-muted-foreground">{s.handle}</span>
                </span>
                <ArrowUpRight
                  className="h-5 w-5 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-500"
                  aria-hidden
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}