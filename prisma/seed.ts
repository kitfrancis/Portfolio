import prisma from "@/lib/db";

async function main() {
    const projects = [
    {
      title: "E-Capstone: System Management of the University of Antique",
      description: "A web-based application designed to streamline and enhance the management of various administrative tasks within the University of Antique. The system offers a comprehensive suite of features, including student information management, course scheduling, faculty administration, and communication tools. By centralizing these functions, the E-Capstone system aims to improve efficiency, reduce paperwork, and facilitate better communication between students, faculty, and administrative staff.",
      imageUrl: "/images/nextjs.png",
    },
]

    for (const post of projects) {
        await prisma.project.create({
            data: post,
        });
    }
    console.log("Seeding completed successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });