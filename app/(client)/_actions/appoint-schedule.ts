'use server'
import { db } from "@/lib/db"
import { DateToUTCDate } from "@/lib/helpers"
import { CreateAppointmentSchema, CreateAppointmentSchemaType } from "@/schema/appointment"
import * as postmark from "postmark"

const serverToken = process.env.NEXT_PUBLIC_POSTMARK_SERVER_TOKEN as string
const client = new postmark.ServerClient(serverToken)


export async function CreateAppointment(form: CreateAppointmentSchemaType) {
    const parsedBody = CreateAppointmentSchema.safeParse(form)
    if (!parsedBody.success) {
        throw new Error(parsedBody.error.message)
    }

    const {
        //Set 1
        title, email, fullname, contact_person, department,
        //Set 2
        event_date, start_time, end_time, purpose,venue,
        //set 3
        does_have_dry_run,
        dry_run_date,
        dry_run_start_time,
        dry_run_end_time,
        does_have_assistance,
        name_of_assistance,
        //set 4
        meeting_type_option,
        meeting_type_service,
        reminder,
        panelist,
        
        meeting_type_link,
        camera_setup,
        status
    } = parsedBody.data

    const tcet_assistance = does_have_assistance.join()
    const meeting_service = meeting_type_service.join()
    const event_actual_date = DateToUTCDate(event_date)
    
    const currentReminder = reminder ? reminder.join(',') : null

 

    await db.$transaction(async (prisma) => {
        const appointment = await prisma.appointment.create({
            data: {
                title, email, fullname, contact_person, department,
                //Set 2
                event_date,
                start_time,
                end_time,
                purpose,
                venue,

                //set 3
                does_have_dry_run,
                dry_run_date,
                dry_run_start_time,
                dry_run_end_time,
                does_have_assistance: tcet_assistance,
                name_of_assistance,

                //set 4
                meeting_type_option,
                meeting_type_service: meeting_service,    
                reminder: currentReminder,
                panelist,
                meeting_type_link,
                camera_setup,
                status
            }
        })

        await prisma.scheduleDate.create({
            data: {
                day: event_date.getUTCDate(),
                month: event_date.getMonth(),
                year: event_date.getFullYear(),
                appointmentId: appointment.id
            }
        })

        // await client.sendEmail({
        //     "From": "support@tcet.tualearning.com",
        //     "To": email,
        //     "Subject": "Appointment Confirmation",
        //     "TextBody": `

        //         Dear ${fullname},

        //         Your appointment has been confirmed with the following details:

        //         Title: ${title}
        //         Date: ${event_date.toDateString()}
        //         Time: ${start_time} - ${end_time}
        //         Purpose: ${purpose}

        //         Thank you for using our service.

        //         Best regards,
        //         Your Appointment Team

        //         if you encounter any problem or conercn, please email tcet@tua.edu.ph
        //     `,
        //     "MessageStream": "outbound",

        // },)
    }, {
        timeout: 15000
    })
}
