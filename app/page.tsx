import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/db";
import LoginPopover from "./components/LoginPopover";
import EditableHero from "./components/editableHero";
import ScrollExtras from "./components/ScrollExtras";
import ProjectAccordion from "./components/ProjectAccordion";

export const metadata = {
  alternates: { canonical: "/" },
};

export const revalidate = 0;

const SOCIALS = [
  { label: "facebook", handle: "kitbesa", href: "https://facebook.com/kitbesa" },
  { label: "github", handle: "kitfrancis", href: "https://github.com/kitfrancis" },
  { label: "instagram", handle: "kititeee", href: "https://www.instagram.com/kititeee/" },
];

type Education = {
  level: string;
  levelClass: string;
  school: string;
  program: string;
  years: string;
  address?: string;
  description: string;
  details?: { icon: string; label: string; value: string }[];
  expandLabel?: string;
  expandItems?: string[];
};

// Add more entries (e.g. Junior High, Elementary) to this array and they will appear automatically.
const EDUCATION: Education[] = [
  {
    level: "College",
    levelClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    school: "University of Antique",
    program: "BS in Information Technology",
    years: "2022 — Present",
    address: "University of Antique Main Campus, Sibalom, Antique",
    description:
      "Focusing on full-stack web development, software architectural patterns, and capstone research. Leading development on thesis management systems and campus event portals.",
 
    expandLabel: "View Key University Subjects & Tech",
    expandItems: [
      "Full-stack web development",
      "Software architectural patterns",
      "Capstone research",
      "Thesis management system",
      "Campus event portal",
    ],
  },
  {
    level: "Senior High School",
    levelClass: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    school: "Pangpang National High School - Senior High School",
    program: "ABM Strand (Accountancy, Business, and Management) ",
    years: "2020 — 2022",
    address: "Pangpang, Sibalom, Antique",
    description:
      "Foundation in business principles, economics, and financial literacy. Developed critical thinking, public speaking, and basic accounting skills.",
  },
  {
    level: "Junior High School",
    levelClass: "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400",
    school: "Pangpang National High School",
    program: "Junior High School (Grades 7–10)",
    years: "2016 — 2020",
    address: "Pangpang, Sibalom, Antique",
    description:
      "Focused on strengthening core subjects including mathematics, science, and Filipino. Participated in school clubs and competitions that enhanced leadership and teamwork.",
  },
  {
    level: "Elementary",
    levelClass: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    school: "Alangan, Bungsod, Cubay Elementary School",
    program: "Primary Education (Grades 1–6)",
    years: "2010 — 2016",
    address: "Bungsod, Sibalom, Antique",
    description: "Elementary education focused on literacy, numeracy, and basic social skills.",
  },
];

async function safe<T>(label: string, query: Promise<T[]>): Promise<T[]> {
  try {
    return await query;
  } catch (error) {
    console.error(`DB query failed [${label}]:`, error);
    return [];
  }
}

const sectionLabel = "mb-7 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted-foreground";
const rule = "h-px flex-1 bg-border";

export default async function Home() {
  const [bio, frontendStacks, backendStacks, projects] = await Promise.all([
    safe("bio", prisma.bio.findMany({ orderBy: { createdAt: "desc" } })),
    safe("frontend", prisma.frontendStack.findMany({ orderBy: { createdAt: "desc" } })),
    safe("backend", prisma.backendStack.findMany({ orderBy: { createdAt: "desc" } })),
    safe("projects", prisma.project.findMany({ orderBy: { createdAt: "desc" }, take: 3 })),
  ]);

  const profilepic = bio[0];
  const groups = [
    { title: "Frontend", items: frontendStacks },
    { title: "Backend & database", items: backendStacks },
  ];

  return (
    <main className="min-h-screen scroll-smooth">
      <ScrollExtras />
      <style>{`
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgb(52 211 153 / .6); } 70%,100% { box-shadow: 0 0 0 8px transparent; } }
        .status-dot { animation: pulse-ring 2.4s infinite; }
        @media (prefers-reduced-motion: reduce) { .status-dot { animation: none; } }
      `}</style>

      <div className="mt-1 lg:ml-64 lg:mt-8 lg:px-5">
        <div className="mx-auto max-w-3xl px-4">
          {/* HERO */}
          <section className="grid items-start gap-8 py-12 sm:py-16 md:grid-cols-[1fr_15rem]">
            <div className="order-2 flex flex-col gap-2 md:order-1">
              <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border bg-card px-3 py-1 font-mono text-xs">
                <span className="status-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
                University of Antique
              </span>
              <EditableHero name={bio[0]?.name ?? ""} bio={bio[0]?.bio ?? ""} />
              <div className="mt-2 flex flex-wrap gap-3">
                <Button asChild className="rounded-lg px-5">
                  <Link href="/contact">Contact me</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-lg px-5 font-mono text-xs">
                  <Link href="/projects">View projects</Link>
                </Button>
              </div>
            </div>

            <div className="order-1 w-36 md:order-2 md:w-full md:rotate-2 md:transition md:duration-300 md:hover:rotate-0">
              <img
                src={profilepic?.imageUrl || "/images/nopp.png"}
                alt="Profile portrait"
                className="aspect-[4/5] w-full rounded-2xl border object-cover"
              />
            </div>
          </section>

          {/* CAPABILITIES */}
          <section className="border-t py-14" aria-labelledby="capabilities">
            <h2 id="capabilities" className={sectionLabel}>
              Capabilities <span className={rule} />
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {groups.map((g) => (
                <div key={g.title} className="rounded-2xl border bg-card p-5">
                  <h3 className="flex items-center justify-between text-sm font-bold">
                    {g.title}
                    <span className="font-mono text-xs font-normal text-muted-foreground">{g.items.length}</span>
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {g.items.length > 0 ? (
                      g.items.map((s) => (
                        <span
                          key={s.id}
                          className="rounded-md border px-2.5 py-1 font-mono text-xs text-muted-foreground transition hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400"
                        >
                          {s.name}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Nothing added yet.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ACADEMIC JOURNEY */}
          <section className="border-t py-14" aria-labelledby="education">
            <h2 id="education" className={sectionLabel}>
              Academic journey <span className={rule} />
            </h2>
            <p className="-mt-3 mb-8 text-sm text-muted-foreground">
              From primary elementary foundation to tertiary software engineering degree.
            </p>

            <ol className="relative space-y-6">
              <span aria-hidden className="absolute bottom-0 left-[13px] top-2 w-px bg-border" />
              {EDUCATION.map((e, i) => (
                <li key={e.school} className="relative pl-11">
                  <span
                    className={`absolute left-0 top-5 flex h-7 w-7 items-center justify-center rounded-full border-2 bg-background font-mono text-xs ${
                      i === 0 ? "border-emerald-400 text-emerald-500" : "border-border text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </span>

                  <div className="rounded-2xl border bg-card p-5 sm:p-6">
                    <span className={`inline-block rounded border px-2 py-0.5 font-mono text-[11px] ${e.levelClass}`}>
                      {e.level}
                    </span>

                    <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div>
                        <h3 className="text-lg font-bold leading-snug sm:text-xl">{e.school}</h3>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">{e.program}</p>
                        {e.address && (
                          <p className="mt-1.5 flex items-start gap-1.5 text-xs text-muted-foreground">
                            <span aria-hidden>📍</span>
                            <span>{e.address}</span>
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 font-mono text-xs text-muted-foreground sm:max-w-[7rem] sm:text-right">
                        {e.years}
                      </span>
                    </div>

                    <p className="mt-4 border-t pt-4 text-sm leading-relaxed text-muted-foreground">
                      {e.description}
                    </p>

                    {e.details && (
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {e.details.map((d) => (
                          <div key={d.label} className="rounded-lg border bg-background/50 p-3">
                            <p className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                              {d.icon} {d.label}
                            </p>
                            <p className="mt-1.5 text-sm">{d.value}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {e.expandItems && (
                      <details className="group mt-4">
                        <summary className="flex cursor-pointer list-none items-center gap-2 font-mono text-xs text-muted-foreground transition hover:text-foreground [&::-webkit-details-marker]:hidden">
                          <span className="transition group-open:rotate-90">›</span>
                          {e.expandLabel}
                        </summary>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {e.expandItems.map((item) => (
                            <span
                              key={item}
                              className="rounded-md border px-2.5 py-1 font-mono text-xs text-muted-foreground"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* FEATURED WORK */}
          <section className="border-t py-14" aria-labelledby="work">
            <h2 id="work" className={sectionLabel}>
              Featured work <span className={rule} />
            </h2>
            {projects.length > 0 ? (
              <ProjectAccordion projects={projects} seeAllLink />
            ) : (
              <div className="rounded-xl border border-dashed p-8 text-center">
                <h3 className="font-semibold">No projects yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Log in and use the edit button to add your first project.
                </p>
              </div>
            )}
          </section>

          {/* CONTACT */}
          <section className="border-t py-14">
            <div className="rounded-3xl border bg-card p-7 sm:p-9">
              <h2 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-4xl">
                Have a project in mind?
                <br />
                <span className="text-muted-foreground">Let’s talk.</span>
              </h2>
              <Button asChild className="mt-6 rounded-lg px-5">
                <Link href="/contact">Send a message</Link>
              </Button>
            </div>
          </section>
        </div>

        <footer className="border-t py-10">
          <div className="flex flex-col items-center justify-center gap-3 md:flex-row md:flex-wrap">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border px-3 py-1.5 font-mono text-xs text-muted-foreground transition hover:border-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                {s.label}/{s.handle}
              </a>
            ))}
            <LoginPopover />
          </div>
        </footer>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Kit Francis Besa",
            url: "https://www.kitfrancisbesa.me",
            jobTitle: "Software Engineering Student",
            alumniOf: { "@type": "CollegeOrUniversity", name: "University of Antique" },
            sameAs: SOCIALS.map((s) => s.href),
          }),
        }}
      />
    </main>
  );
}