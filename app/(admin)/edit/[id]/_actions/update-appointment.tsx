'use server'
import { db } from "@/lib/db"
import { CreateAppointmentSchema, CreateAppointmentSchemaType } from "@/schema/appointment"

export async function UpdateAppointment(form: CreateAppointmentSchemaType, id: string) {
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
        panelist,
        reminder,
        //set 4
        meeting_type_option,
        meeting_type_service,
        meeting_type_link,
        camera_setup,
        status,
        editedBy,
        other_training
    } = parsedBody.data

    const tcet_assistance = does_have_assistance.join()
    const meeting_service = meeting_type_service.join()
    const currentReminder = reminder ? reminder.join(',') : null
    const assitedBy = editedBy ? editedBy.join(',') : null
    
    await db.$transaction(async (prisma) => {
        const appointment = await prisma.appointment.update({
            where:{
                id: id
            },
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
                panelist,
                reminder: currentReminder,
                meeting_type_link,
                camera_setup,
                other_training,


                //additional input
                editedBy: assitedBy
            }
        })

        const existingScheduleDate = await prisma.scheduleDate.findFirst({
            where: {
                appointmentId: appointment.id
            }
        })


        if (existingScheduleDate) {
            // Update existing ScheduleDate
            await prisma.scheduleDate.update({
                where: {
                    id: existingScheduleDate.id
                },
                data: {
                    day: event_date.getUTCDate(),
                    month: event_date.getMonth(),
                    year: event_date.getFullYear()
                }
            })
        } else {
            // Create new ScheduleDate if it doesn't exist
            await prisma.scheduleDate.create({
                data: {
                    day: event_date.getUTCDate(),
                    month: event_date.getMonth(),
                    year: event_date.getFullYear(),
                    appointmentId: appointment.id
                }
            })
        }
    })
}
