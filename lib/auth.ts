import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
// If your Prisma file is located elsewhere, you can change the path
// import { PrismaClient } from "@prisma/client"; // Adjust the import path as necessary
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/argon2-server";


 
// const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
        
 
    }),
   emailAndPassword: {  
        enabled: true,
        minPasswordLength: 6,
        autoSignIn: false,
        requireEmailVerification: false, // Optional, set to true if you want to require email verification
        password:{
            hash: hashPassword, 
            verify: verifyPassword,
        },
    },
    advanced: {
        database:{
            generateId: false,
        },
    },
    plugins: [nextCookies()],  
    // socialProviders: { 
    //     github: { 
    //        clientId: process.env.GITHUB_CLIENT_ID as string, 
    //        clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
    //     }, 
    // }, 
});