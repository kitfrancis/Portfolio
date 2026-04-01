import prisma from "@/lib/db";

async function main() {

    const frontendStacks = [
        { name: "React" },
        { name: "Nextjs" },
        { name: "Tailwind CSS" },
        { name: "TypeScript" },
        { name: "React(Vite)" },
        { name: "React(Native)" },
        { name: "HTML" },
        { name: "CSS" },
        { name: "JavaScript" },

    ];

    const backendStacks = [
        { name: "Node.js" },
        { name: "Express" },
        { name: "Prisma" },
        { name: "PostgreSQL" },
        { name: "MongoDB" },
        { name: "MySQL" },
        { name: "Convex" },
    ];

    
    const projects = [
    {
      title: "E-Capstone: System Management of the University of Antique",
      description: "A web-based application designed to streamline and enhance the management of various administrative tasks within the University of Antique. The system offers a comprehensive suite of features, including student information management, course scheduling, faculty administration, and communication tools. By centralizing these functions, the E-Capstone system aims to improve efficiency, reduce paperwork, and facilitate better communication between students, faculty, and administrative staff.",
      imageUrl: "/images/nextjs.png",
      category: "web",
    },
    {
      title: "I-learn: An E-Learning Platform for the University of Antique",
      description: "A mobile application designed to provide a seamless learning experience for students at the University of Antique. The platform offers a wide range of educational resources, interactive content, and communication tools to enhance student engagement and facilitate effective learning.",
      imageUrl: "/images/i-learn.png",
      category: "mobile",
    },
]

    for (const post of projects) {
        await prisma.project.create({
            data: post,
        });
    }
    console.log("Seeding completed successfully.");

    await prisma.frontendStack.createMany({
  data: frontendStacks,
  skipDuplicates: true,
});
    console.log("Frontend stacks seeding completed successfully.");

    await prisma.backendStack.createMany({
  data: backendStacks,
  skipDuplicates: true,
});
    console.log("Backend stacks seeding completed successfully.");


   

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });