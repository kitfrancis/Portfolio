import prisma from "@/lib/db";

async function main() {

    const bio = await prisma.bio.findFirst();

    if (!bio) {     
        await prisma.bio.create({
            data: {
                name: "Kit Francis Besa",
                bio: "Hi I'm Kit Francis Besa, a passionate and dedicated software developer with a strong background in web and mobile application development. With a keen eye for detail and a commitment to writing clean, efficient code, I strive to create innovative solutions that not only meet but exceed client expectations. My expertise spans across various technologies, including React, Next.js, Node.js, and Prisma, allowing me to build robust and scalable applications. I am constantly seeking new challenges and opportunities to grow as a developer while contributing to impactful projects."
            }
        });
        console.log("Bio seeded successfully.");
    } else {
        console.log("Bio already exists. Skipping seeding.");
    }

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