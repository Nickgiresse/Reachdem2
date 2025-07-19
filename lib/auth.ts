import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
// import { PrismaClient } from "@prisma/client"; // Adjust the import path as necessary
import { prisma } from "@/lib/prisma";


 
// const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
        

    }),
   emailAndPassword: {  
        enabled: true,
        minPasswordLength: 6,
        requireEmailVerification: false, // Optional, set to true if you want to require email verification
    },
    // socialProviders: { 
    //     github: { 
    //        clientId: process.env.GITHUB_CLIENT_ID as string, 
    //        clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
    //     }, 
    // }, 
});