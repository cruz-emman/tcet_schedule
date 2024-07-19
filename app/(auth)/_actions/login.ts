'use server'

import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { LoginSchema, LoginSchemaType } from "@/schema/user";
import { AuthError } from "next-auth";

export async function LoginAccount(values: LoginSchemaType) {
    // Ensure that safeParse returns an object with 'success' or 'error'
    const parsedBody = LoginSchema.safeParse(values);
    if (!parsedBody.success) {
        throw new Error(parsedBody.error.message);
    }

    const { email, password } = parsedBody.data;

    const existingUser = await db.user.findUnique({
        where: {
            email,
        },
    });

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Invalid credentials" };
    }

    try {
        await signIn("credentials", {
            email,
            password,
    });
         return {success: "Successfully Login! "}
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {error: "Invalid credentials!"}
                default:
                    return {error: "Invalid credentials!"}
            }
        }
        throw error;
    }
}
