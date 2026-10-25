"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Check, ArrowUpRight } from "lucide-react";

// TODO: put your real email and profile URLs here
const EMAIL = "kitfrancis08@gmail.com";
const SOCIALS = [
  { label: "GitHub", handle: "kitfrancis", href: "https://github.com/kitfrancis" },
  { label: "LinkedIn", handle: "kitfrancis-besa", href: "https://linkedin.com/in/" },
  { label: "Facebook", handle: "Kit Francis Sabrine Besa", href: "https://facebook.com/" },
];

const field =
  "w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-500";
const labelClass = "font-mono text-xs text-muted-foreground";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
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

  // Front-end only: opens the visitor's email app with the message filled in
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <main className="min-h-screen">
      <div className="mt-1 lg:ml-64 lg:mt-8 lg:px-5">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Contact</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tighter sm:text-6xl">
            Have a project in mind?
            <span className="block text-muted-foreground">Let’s talk.</span>
          </h1>

          <div className="mt-12 grid gap-4 md:grid-cols-[1.4fr_1fr]">
            {/* Message form */}
            <form onSubmit={send} className="grid gap-4 rounded-2xl border bg-card p-6">
              <div className="grid gap-1.5">
                <label htmlFor="c-name" className={labelClass}>Your name</label>
                <input
                  id="c-name"
                  className={field}
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="c-msg" className={labelClass}>Message</label>
                <textarea
                  id="c-msg"
                  className={`${field} h-36 resize-none`}
                  placeholder="What would you like to build?"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <Button type="submit" className="rounded-lg">Send by email</Button>
              <p className="text-xs text-muted-foreground">
                This opens your email app with the message ready to send.
              </p>
            </form>

            {/* Direct contact */}
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border bg-card p-6">
                <p className={labelClass}>Email</p>
                <p className="mt-2 break-all font-mono text-sm">{EMAIL}</p>
                <Button variant="outline" size="sm" onClick={copyEmail} className="mt-4 rounded-lg font-mono text-xs">
                  {copied ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy address"}
                </Button>
              </div>

              <div className="rounded-2xl border bg-card p-3">
                <p className={`${labelClass} px-3 pb-1 pt-3`}>Elsewhere</p>
                <ul>
                  {SOCIALS.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                      >
                        <span>
                          <span className="block font-medium">{s.label}</span>
                          <span className="block font-mono text-xs text-muted-foreground">{s.handle}</span>
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-cyan-500" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}