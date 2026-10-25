import prisma from "@/lib/db";
import ProjectAccordion from "../components/ProjectAccordion";

export const revalidate = 0;

async function getProjects() {
  try {
    return await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    console.error("DB query failed [projects]:", error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen">
      <div className="mt-1 lg:ml-64 lg:mt-8 lg:px-5">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Projects</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tighter sm:text-6xl">Things I’ve built.</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            {projects.length > 0
              ? `${projects.length} ${projects.length === 1 ? "project" : "projects"}. Open one to see the details.`
              : "Nothing here yet."}
          </p>

          <div className="mt-10">
            {projects.length > 0 ? (
              <ProjectAccordion projects={projects} showFilter />
            ) : (
              <div className="rounded-xl border border-dashed p-10 text-center">
                <h2 className="font-semibold">No projects yet</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Log in on the home page and use the edit button to add your first project.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}