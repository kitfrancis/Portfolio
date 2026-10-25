import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/db";
import LoginPopover from "./components/LoginPopover";
import EditableHero from "./components/editableHero";
import ScrollExtras from "./components/ScrollExtras";
import ProjectAccordion from "./components/ProjectAccordion";

export const revalidate = 0;

const SOCIALS = [
  { label: "facebook", handle: "Kit Francis Sabrine Besa", href: "https://facebook.com/" },
  { label: "github", handle: "kitfrancis", href: "https://github.com/kitfrancis" },
  { label: "linkedin", handle: "kitfrancis-besa", href: "https://linkedin.com/in/" },
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
    </main>
  );
}