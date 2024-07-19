import type { NextAuthConfig } from "next-auth"
import credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schema/user";
import { db } from "./lib/db";
import bcrypt from 'bcryptjs'

 
export default { providers: [
    credentials({
        async authorize(credentials){
            const validatedFields = LoginSchema.safeParse(credentials);

            if(validatedFields.success){
                const {email, password} = validatedFields.data;
                const user = await db.user.findUnique({
                    where: {
                        email: email
                    }
                });
                if(!user || !user.password) return null;


                const passwordsMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                if(passwordsMatch) return user;
                

            }

            return null
        }
    })
] } satisfies NextAuthConfig