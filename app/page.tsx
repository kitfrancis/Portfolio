
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import prisma from "@/lib/db";
import { toast } from "sonner";
import LoginPopover from "./components/LoginPopover";
import EditableHero from "./components/editableHero";

export const revalidate = 0;


export default async function Home() {

  const bio = await prisma.bio.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  

  const frontendStacks = await prisma.frontendStack.findMany({
    orderBy: {
      createdAt: "desc",
    },
    
  })

  const backendStacks = await prisma.backendStack.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })


  const projects = await prisma.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 3
  })

  return (
    <main className="min-h-screen scroll-smooth">
        <div className="lg:ml-64 mt-1 lg:mt-13  max-h-auto lg:px-5">
          <div className="max-w-full mx-auto py-5 p-6 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  
                 <EditableHero name="Kit Francis Besa" bio="Kit Francis Besa"/>                
                  <div className="flex gap-4 items-center justify-center lg:justify-start">
                    <Button className="" asChild>
                      <Link className=" hover:bg-primary/90" href="/projects">View Projects</Link>
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

             
            

              <div className="max-w-full mx-auto py-5 p-6">
                <h1 className="font-bold sm:text-3xl text-2xl my-8 md:my-10 ">{"<Tech Stack/>"}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="flex flex-col gap-4">
                    <h1 className="font-semibold sm:text-2xl text-xl mb-4 ">{"<Frontend>"}</h1>
                    <div className="flex flex-wrap gap-4">
                  
                      {frontendStacks.length > 0 ? (
                  frontendStacks.map((frontend) => (
                    <Badge key={frontend.id} variant="outline" className="text-md px-2 py-3 rounded-xl bg-background text-foreground text-xs lg:text-sm">{frontend.name}</Badge>
                  ))
                ) : (
                  <div className="text-center col-span-full flex flex-col items-center justify-center gap-2">
                      <h1 className="text-lg ">No frontend knowledge</h1>
                      <p className="text-gray-400">Learn more about frontend technologies.</p>
                  </div>
                )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <h1 className="font-medium sm:text-2xl text-xl mb-4 ">{"</Backend & Database>"}</h1>
                    <div className="flex flex-wrap gap-4 mb-10">
                      {backendStacks.length > 0 ? (
                  backendStacks.map((backend) => (
                    <Badge key={backend.id} variant="outline" className="text-md px-2 py-3 rounded-xl bg-background text-foreground text-xs lg:text-sm">{backend.name}</Badge>
                  ))
                ) : (
                  <div className="text-center col-span-full flex flex-col items-center justify-center gap-2">
                      <h1 className="text-lg ">No backend knowledge</h1>
                      <p className="text-gray-400">Learn more about backend and database technologies.</p>
                  </div>
                )}



                    </div>
                  </div>

                </div>

                

                </div>
                <hr className="w-full border-solid border-gray-300 mt-4"/>
             
              <div className="max-w-full mx-auto py-5 p-6">
                <h1 className="font-bold sm:text-3xl text-2xl my-13 md:my-15 ">Featured Projects</h1>
                

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
                  <div className="text-center col-span-full flex flex-col items-center justify-center gap-2">
                      <h1 className="text-lg ">No projects created yet.</h1>
                      <p className="text-gray-400">Add some projects to see them here.</p>
                  </div>
                )}
              </div>

              <Button variant={"link"} className="mt-6">
                <Link className="flex items-center  gap-2" href="/projects"> View All Projects <ArrowRight/></Link>
              </Button>
              </div>



          </div>

          <footer className=" border-t border-gray-300  mt-10 py-10">
            
            <div className="flex flex-col md:flex-row gap-2 md:gap-5 justify-center items-center">
                <h1 className="flex items-center text-gray-500 gap-1 text-xs"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600 hover:text-blue-700 transition"><path d="M22 12.07C22 6.48 17.52 2 12 2S2 6.48 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.75 8.44-4.91 8.44-9.93z"/></svg>
                    facebook.com/Kit Francis Sabrine Besa</h1>
                <h1 className="flex items-center text-gray-500 gap-1 text-xs"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"> <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.52 1.05 1.52 1.05.88 1.55 2.3 1.1 2.86.84.09-.66.34-1.1.62-1.35-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.72 0 0 .84-.27 2.75 1.05A9.2 9.2 0 0112 6.84c.82 0 1.64.11 2.4.33 1.9-1.32 2.74-1.05 2.74-1.05.55 1.42.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.57 5.06.35.31.67.92.67 1.86 0 1.34-.01 2.42-.01 2.75 0 .27.18.6.69.49A10.03 10.03 0 0022 12.26C22 6.58 17.52 2 12 2z"/>
                    </svg>github.com/kitfrancis</h1>
                <h1 className="flex items-center text-gray-500 gap-1 text-xs"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"> <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.66H9.37V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/>
                    </svg>linkedin.com/in/kitfrancis besa</h1>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-5 justify-center items-center">
                    
                     <LoginPopover/>
                       
                    
                   

                    </div>
                    
   
            </div>
            
        </footer>

        </div>
    </main>
  )
}