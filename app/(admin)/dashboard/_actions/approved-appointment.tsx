'use server'

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function ApprovedAppointment(id: string) {
    const session = await auth()

    if (!session || !session.user) {
        throw new Error("Unauthorized")
    }

    try {
        const result = await db.$transaction(async (prisma) => {

            const updatedAppointment = await prisma.appointment.update({
                where: {
                    id: id
                },
                data: {
                    status: 'approved',
                    User: {
                        connect: {
                            id: session.user?.id
                        }
                    }
                },
                include: {
                    User: true
                }
            })

            await prisma.additionalDates.updateMany({
                where: {
                    appointmentId: id
                },
                data: {
                    additional_status: 'approved'
                }
            })
            return updatedAppointment;

        })

        return result

    } catch (error) {
        throw error;
    }
}