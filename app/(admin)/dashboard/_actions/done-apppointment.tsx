'use server'

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function DoneAppointment(id: string) {
    const session = await auth()

    if (!session || !session.user) {
        throw new Error("Unauthorized")
    }

    try {
        const data = await db.appointment.update({
            where: {
                id: id
            },
            data: {
                status: 'done',
                User: { 
                    connect: { id: session.user.id }
                }
            },
            include: {
                User: true
            }
        })

        return data;
    } catch (error) {
        throw error;
    }
}