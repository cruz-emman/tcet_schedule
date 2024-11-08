'use server'

import { auth } from "@/auth";
import { db } from "@/lib/db";
import * as postmark from "postmark"


const serverToken = process.env.NEXT_PUBLIC_POSTMARK_SERVER_TOKEN as string
const client = new postmark.ServerClient(serverToken)

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

        await client.sendEmailWithTemplate({
            "From": "no-reply@tcet.tualearning.com",
            "To": result.email,
            "TemplateId": 37887388,
            "TemplateModel": {
                "company_email": "tcet@tua.edu.ph",
                "company_name": "TCET",
                "company_address": "275 E. Rodriguez Sr. Avenue, Quezon City, Philippines",
                "fullname": result.fullname,
                "title": result.title,
                "event_date": result.event_date.toDateString(),
                "start_time": result.start_time,
                "end_time": result.end_time,
                "department": result.department,
                "contact_person": result.contact_person,
                "meeting_type_option": result.meeting_type_option,
                "purpose": result.purpose,
                "calendar_link": "https://tcet-schedule.vercel.app/"
            },
            "MessageStream": "outbound"
        });

        return result

    } catch (error) {
        throw error;
    }
}