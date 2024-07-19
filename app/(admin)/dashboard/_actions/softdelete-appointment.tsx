'use server'

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function SoftDeleteAppointment(id: string) {
    const session = await auth()

    if (!session || !session.user) {
        throw new Error("Unauthorized")
    }

    try {
       
        await db.$transaction(async (prisma) => {
            const appointment = await prisma.appointment.update({
                where: {
                    id:id
                },
                data: {
                    soft_delete: true
                }
            })
            const existingScheduleDate = await prisma.scheduleDate.findFirst({
                where: {
                    appointmentId: appointment.id
                }
            })

            if(existingScheduleDate){
                await prisma.scheduleDate.update({
                    where:{
                        id: existingScheduleDate.id
                    },
                    data: {
                        soft_delete_scheduleDate: true
                    }
                })
            }
    
        })

        Response.json("Appointment successfully deleted!")
    } catch (error) {
        Response.json("An error has been occured.")
    }
}