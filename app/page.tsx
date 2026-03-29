import { Button } from "@/components/ui/button";
import * as React from "react";

import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ThemeProvider, ThemeToggle } from "@/components/ui/theme-provider";
import prisma from "@/lib/db";


export default async function Home() {

  const projects = await prisma.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 3
  })
  return (
    <main className="min-h-screen scroll-smooth">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
        <div className="lg:ml-64 mt-1 lg:mt-13  max-h-auto lg:px-5">
          <div className="max-w-full mx-auto py-5 p-6 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h1 className=" text-2xl font-bold sm:text-3xl">Hi,  I&apos;m Kit Francis Besa</h1>
                  <p className="py-5 sm:py-6 text-sm sm:text-lg  ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium asperiores repellendus nam dicta ut sint tempora distinctio, architecto hic perferendis minima aliquid a maiores nulla?</p>
                  <div className="flex gap-4">
                    <Button asChild>
                      <Link className="bg-primary text-primary-foreground rounded-lg hover:bg-primary/90" href="/contact">Get in Touch</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/cv"><MessageCircle  className="w-4 h-4  mr-1"/> Contact Me</Link>
                    </Button>
                  </div>
                </div>
                 <div className="max-w-full mx-auto ">
                <img className="h-56 w-56 sm:h-70 sm:w-90 sm:pr-10"   src="/images/nopp.png" alt=""/>
              </div>
              
            </div>
              <hr className="w-full border-solid border-gray-300 mt-4"/>
             
              <div className="max-w-full mx-auto py-5 p-6">
                <h1 className="font-bold sm:text-3xl text-2xl my-13 md:my-15 ">Projects</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <Card key={project.id} className="relative mx-auto w-full max-w-sm bg-background  pt-0">
                      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
                      <img
                        src={project.imageUrl}
                        alt={`${project.title} cover`}
                        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
                      />
                      <CardHeader>
                        <CardAction>
                          <Badge className="" variant="ghost">Featured</Badge>
                        </CardAction>
                        <CardTitle className="">{project.title}</CardTitle>
                        <CardDescription className="line-clamp-3 ">{project.description}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button className="w-full "><Link href="/projects">View Project</Link></Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-gray-500 col-span-full">No projects found.</p>
                )}
              </div>

              <Button variant={"link"} className="mt-6">
                <Link className="flex items-center  gap-2" href="/projects"> View All Projects <ArrowRight/></Link>
              </Button>
              </div>



          </div>

        </div>
    </main>
  )
}