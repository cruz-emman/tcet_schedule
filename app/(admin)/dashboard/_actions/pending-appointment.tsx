'use server'

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function PendingAppointment(id: string) {
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
                status: 'pending',
                User: {
                    set: []
                }
            }
        })

        return data;
    } catch (error) {
        throw error;
    }
}