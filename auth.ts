import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "@/auth.config"

import { db } from "./lib/db"

// Your own logic for dealing with plaintext password strings; be careful!

export const { handlers, signIn, signOut, auth } = NextAuth({
    
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
    callbacks: {
        session({ session, token }) {
            if(token.sub && session.user){
                session.user.id = token.sub
              }
        
              return session
        },
        async jwt({ token, user }) {
            if(!token.sub) return token;
                
            const existingUser = await db.user.findUnique({
                where: {
                    id: token.sub
                }
            })

            if(!existingUser) return token


            return token
        },

    }
})