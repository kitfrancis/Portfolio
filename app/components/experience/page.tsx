import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Experience | Kit Francis Besa",
  description: "Hands-on experience building web apps, from thesis systems to campus portals.",
  alternates: { canonical: "/experience" },
};

type Experience = {
  type: string;
  typeClass: string;
  title: string;
  org: string;
  years: string;
  current?: boolean;
  summary: string;
  highlights: string[];
  stack: string[];
};

// NOTE: These entries are starter content based on your portfolio.
// Edit titles, dates, highlights and stack to match your real experience.
const EXPERIENCE: Experience[] = [
  {
    type: "Project",
    typeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    title: "Thesis Management System",
    org: "University of Antique",
    years: "2024 — Present",
    current: true,
    summary:
      "Lead developer of a web platform that helps students and advisers submit, review, and track thesis progress.",
    highlights: [
      "Designed the database schema and role-based access for students, advisers, and admins.",
      "Built responsive dashboards and submission flows with a focus on clarity and speed.",
      "Handled deployment, testing, and iteration based on faculty feedback.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma"],
  },
  {
    type: "Project",
    typeClass: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    title: "Campus Event Portal",
    org: "University of Antique",
    years: "2023 — 2024",
    summary:
      "A portal for announcing, registering, and managing campus events in one place.",
    highlights: [
      "Created event listing, detail, and registration pages with mobile-first layouts.",
      "Implemented an admin area for creating and editing events.",
      "Improved accessibility with semantic markup, focus states, and reduced-motion support.",
    ],
    stack: ["React", "Next.js", "PostgreSQL", "shadcn/ui"],
  },
  {
    type: "Personal",
    typeClass: "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400",
    title: "Personal Portfolio",
    org: "kitfrancisbesa.me",
    years: "2023 — Present",
    current: true,
    summary:
      "A fully editable portfolio where bio, tech stacks, and projects are managed from a login-protected dashboard.",
    highlights: [
      "Server-rendered pages with structured data (JSON-LD) for better SEO.",
      "Light and dark themes, scroll effects, and an accessible component system.",
      "Database-driven content so updates never require a redeploy.",
    ],
    stack: ["Next.js", "Prisma", "Tailwind CSS", "Vercel"],
  },
];

const STATS = [
  { value: "3+", label: "Projects shipped" },
  { value: "4", label: "Core technologies" },
  { value: "2022", label: "Started building" },
];

const PRINCIPLES = [
  { title: "Clarity first", text: "Interfaces should explain themselves. Clear hierarchy beats decoration." },
  { title: "Accessible by default", text: "Keyboard focus, contrast, and motion preferences are part of the build, not an afterthought." },
  { title: "Mobile-first", text: "Start small, then enhance. Every layout is tested on a phone before a desktop." },
  { title: "Ship and iterate", text: "Get something real in front of users early, then refine from feedback." },
];

const sectionLabel =
  "mb-7 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted-foreground";
const rule = "h-px flex-1 bg-border";

export default function ExperiencePage() {
  return (
    <main className="min-h-screen scroll-smooth">
      <style>{`
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgb(52 211 153 / .6); } 70%,100% { box-shadow: 0 0 0 8px transparent; } }
        .status-dot { animation: pulse-ring 2.4s infinite; }
        @media (prefers-reduced-motion: reduce) { .status-dot { animation: none; } }
      `}</style>

      <div className="mt-1 lg:ml-64 lg:mt-8 lg:px-5">
        <div className="mx-auto max-w-3xl px-4">
          {/* HEADER */}
          <section className="py-12 sm:py-16">
            <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border bg-card px-3 py-1 font-mono text-xs">
              <span className="status-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Open to opportunities
            </span>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tighter sm:text-5xl">
              Experience
              <br />
              <span className="text-muted-foreground">Building interfaces that work.</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              A look at the products I&apos;ve designed and developed, and the way I think about
              creating clear, accessible, and fast user experiences.
            </p>

            <dl className="mt-8 grid grid-cols-3 gap-3">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-2xl border bg-card p-4 text-center sm:p-5">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-2xl font-extrabold tracking-tight sm:text-3xl">{s.value}</dd>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </dl>
          </section>

          {/* TIMELINE */}
          <section className="border-t py-14" aria-labelledby="timeline">
            <h2 id="timeline" className={sectionLabel}>
              Timeline <span className={rule} />
            </h2>

            <ol className="relative space-y-6">
              <span aria-hidden className="absolute bottom-0 left-[13px] top-2 w-px bg-border" />
              {EXPERIENCE.map((e) => (
                <li key={e.title} className="relative pl-11">
                  <span
                    aria-hidden
                    className={`absolute left-[7px] top-6 h-3.5 w-3.5 rounded-full border-2 bg-background ${
                      e.current ? "border-emerald-400" : "border-border"
                    }`}
                  />

                  <article className="group py-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-block rounded border px-2 py-0.5 font-mono text-[11px] ${e.typeClass}`}>
                        {e.type}
                      </span>
                      {e.current && (
                        <span className="inline-block rounded border border-emerald-500/30 px-2 py-0.5 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                          Ongoing
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div>
                        <h3 className="text-lg font-bold leading-snug sm:text-xl">{e.title}</h3>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">{e.org}</p>
                      </div>
                      <span className="shrink-0 font-mono text-xs text-muted-foreground sm:text-right">
                        {e.years}
                      </span>
                    </div>

                    <p className="mt-4 border-t pt-4 text-sm leading-relaxed text-muted-foreground">
                      {e.summary}
                    </p>

                    <details className="group/details mt-4">
                      <summary className="flex cursor-pointer list-none items-center gap-2 font-mono text-xs text-muted-foreground transition hover:text-foreground [&::-webkit-details-marker]:hidden">
                        <span className="transition group-open/details:rotate-90">›</span>
                        What I did
                      </summary>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {e.highlights.map((h) => (
                          <li key={h} className="flex gap-2">
                            <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </details>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {e.stack.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border px-2.5 py-1 font-mono text-xs text-muted-foreground transition hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </section>

          {/* PRINCIPLES */}
          <section className="border-t py-14" aria-labelledby="principles">
            <h2 id="principles" className={sectionLabel}>
              How I design <span className={rule} />
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {PRINCIPLES.map((p, i) => (
                <div key={p.title} className="rounded-2xl border bg-card p-5">
                  <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-sm font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="border-t py-14">
            <div className="rounded-3xl border bg-card p-7 sm:p-9">
              <h2 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-4xl">
                Want to work together?
                <br />
                <span className="text-muted-foreground">Let&apos;s build something.</span>
              </h2>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="rounded-lg px-5">
                  <Link href="/contact">Send a message</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-lg px-5 font-mono text-xs">
                  <Link href="/projects">View projects</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}