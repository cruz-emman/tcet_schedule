'use server'
import bcrypt from 'bcryptjs';
import { db } from "@/lib/db";
import { RegisterSchema, RegisterSchemaType } from "@/schema/user";

export async function RegisterAccount(form: RegisterSchemaType) {
    const parsedBody = RegisterSchema.safeParse(form);

    if (!parsedBody.success) {
        throw new Error(parsedBody.error.message);
    }

    const { email, password, name } = parsedBody.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Check if the email already exists
        const existingEmail = await db.user.findFirst({
            where: { email }
        });

        if (existingEmail) {
            throw new Error("Email already exists");
        }

        // Create the new user
        await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return { success: true };
    } catch (err) {
        console.error('Error during registration:', err);
        throw new Error('Registration failed');
    }
}
