"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Command } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-provider";
import VisitorCount from "./VisitorCount";
const links = [
  { name: "About me", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [name, setName] = useState("Kit Francis Besa");
  const [imageUrl, setImageUrl] = useState("/images/nopp.png");
  const [time, setTime] = useState("");
  const [progress, setProgress] = useState(0);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const commands = [
    ...links.map((l) => ({ label: `Go to ${l.name}`, hint: "page", run: () => router.push(l.href) })),
    { label: "Scroll to top", hint: "action", run: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
  ];
  const shown = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => setIsMenuOpen(false), [pathname]);

  useEffect(() => {
    fetch("/api/bio")
      .then((r) => r.json())
      .then((data) => {
        if (data?.name) setName(data.name);
        if (data?.imageUrl) setImageUrl(data.imageUrl);
      })
      .catch(() => {});
  }, []);

  // Philippines clock
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Manila", hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  // Scroll progress
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Keyboard: Ctrl/Cmd+K toggles the menu, Esc closes things
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      } else if (e.key === "Escape") {
        setPaletteOpen(false);
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (paletteOpen) {
      setQuery("");
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [paletteOpen]);

  const runCommand = (i: number) => {
    const c = shown[i];
    if (!c) return;
    setPaletteOpen(false);
    c.run();
  };

  const onPaletteKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => (shown.length ? (s + 1) % shown.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => (shown.length ? (s - 1 + shown.length) % shown.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runCommand(sel);
    }
  };

  const linkClass = (active: boolean) =>
    `group flex items-center gap-3 rounded-lg px-3 py-2.5 font-mono text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
      active ? "bg-card text-foreground" : "text-muted-foreground hover:bg-card hover:text-foreground"
    }`;

  const navLinks = links.map((l) => {
    const active = isActive(l.href);
    return (
      <Link key={l.name} href={l.href} aria-current={active ? "page" : undefined} className={linkClass(active)}>
        <span className={`h-1.5 w-1.5 rounded-full transition ${active ? "bg-cyan-500" : "bg-border group-hover:bg-cyan-500"}`} />
        {l.name}
      </Link>
    );
  });

  const paletteButton = (
    <button
      onClick={() => setPaletteOpen(true)}
      aria-label="Open command menu"
      className="flex w-full items-center justify-between rounded-lg border bg-card px-3 py-2 font-mono text-xs text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
    >
      <span>Jump to…</span>
      <kbd className="rounded border bg-background px-1.5 py-0.5 text-[0.65rem]">Ctrl K</kbd>
    </button>
  );

  return (
    <>
      {/* Scroll progress */}
      <div aria-hidden className="fixed left-0 top-0 z-60 h-0.5 bg-cyan-500" style={{ width: `${progress}%` }} />

      {/* Desktop sidebar */}
      <nav aria-label="Main" className="fixed left-0 top-0 z-50 hidden h-full w-64 flex-col border-r bg-background lg:flex">
        <div className="flex flex-1 flex-col overflow-y-auto px-6 py-8">
          <img
            className="h-20 w-20 rounded-full border-2 border-cyan-500/60 object-cover"
            src={imageUrl}
            alt={`${name} profile`}
          />
          <h1 className="mt-4 text-lg font-bold leading-tight">{name}</h1>
          <p className="font-mono text-xs text-muted-foreground">Software Engineering</p>

          <div className="mt-8 flex flex-col gap-1">{navLinks}</div>
          <div className="mt-6">{paletteButton}</div>

          <div className="mt-auto pt-8 font-mono text-xs leading-relaxed text-muted-foreground">
  <div className="mb-3">
    <VisitorCount />
  </div>
  <div>
    <span className="text-foreground">{time || "--:--"}</span> PHT
  </div>
  <div>University of Antique</div>
</div>
        </div>
      </nav>

      {/* Mobile top bar */}
      <nav aria-label="Main mobile" className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <img src={imageUrl} alt="" className="h-9 w-9 shrink-0 rounded-full border object-cover" />
            <span className="truncate text-sm font-bold">{name}</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setPaletteOpen(true)}
              aria-label="Open command menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg border transition hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              <Command className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsMenuOpen((o) => !o)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg border transition hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          aria-hidden={!isMenuOpen}
          inert={!isMenuOpen}
          className={`grid transition-all duration-300 ease-in-out ${
            isMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
  <div className="flex flex-col gap-1 px-4 pb-4 pt-1">{navLinks}</div>
  <div className="border-t px-4 py-3">
    <VisitorCount />
  </div>
</div>
        </div>
      </nav>

      {/* Command menu */}
      {paletteOpen && (
        <div
          className="fixed inset-0 z-100 flex items-start justify-center bg-black/55 p-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setPaletteOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onPaletteKey}
            className="w-full max-w-md overflow-hidden rounded-2xl border bg-card shadow-2xl"
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSel(0);
              }}
              placeholder="Type a command…"
              aria-label="Search commands"
              className="w-full border-b bg-transparent px-4 py-3.5 font-mono text-sm outline-none"
            />
            <ul className="max-h-72 overflow-y-auto p-1.5">
              {shown.length === 0 && <li className="p-3 font-mono text-xs text-muted-foreground">No matching command.</li>}
              {shown.map((c, i) => (
                <li key={c.label}>
                  <button
                    onClick={() => runCommand(i)}
                    onMouseEnter={() => setSel(i)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left font-mono text-sm ${
                      i === sel ? "bg-background text-cyan-600 dark:text-cyan-400" : ""
                    }`}
                  >
                    {c.label}
                    <span className="text-xs text-muted-foreground">{c.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}