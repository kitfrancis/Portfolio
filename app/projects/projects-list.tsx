import { Card, CardAction, CardFooter, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

interface ProjectsListProps {
  projects: Project[];
}

export function ProjectsList({ projects }: ProjectsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20 ">
      {projects.length > 0 ? (
        projects.map((project) => (
          <Card key={project.id} className="relative mx-auto w-full max-w-sm pt-0 ">
            <div className="absolute inset-0 z-30 aspect-video " />
            <img
              src={project.imageUrl}
              alt={`${project.title} cover`}
              className="relative z-20 aspect-video w-full object-cover  brightness-90"
            />
            <CardHeader>
              <CardTitle className="flex items-center">{project.title}</CardTitle>
              <CardDescription className="line-clamp-3 mt-2">{project.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="link"   className="w-full ">
                <Link href="/projects">View Project</Link>
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <p className="text-center text-gray-500 col-span-full">No projects found.</p>
      )}
    </div>
  );
}