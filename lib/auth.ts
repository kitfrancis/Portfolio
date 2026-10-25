import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";

const siteUrl = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL;

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    baseURL: siteUrl,
    trustedOrigins: [
        "http://localhost:3000",
        "https://www.kitfrancisbesa.me",
    ],

    emailAndPassword: {
        enabled: true,
        disableSignUp: true,
    },
});