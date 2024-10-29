'use server'
import { db } from "@/lib/db"
import { DateToUTCDate } from "@/lib/helpers"
import { CreateAppointmentSchema, CreateAppointmentSchemaType } from "@/schema/appointment"
import * as postmark from "postmark"

const serverToken = process.env.NEXT_PUBLIC_POSTMARK_SERVER_TOKEN as string
const client = new postmark.ServerClient(serverToken)

export async function CreateAppointment(form: CreateAppointmentSchemaType) {
    const parsedBody = CreateAppointmentSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error(parsedBody.error.message);
    }

    const {
        title, email, fullname, contact_person, department,
        event_date, start_time, end_time, purpose, venue,
        does_have_dry_run, dry_run_date, dry_run_start_time,
        dry_run_end_time, does_have_assistance, name_of_assistance,
        meeting_type_option, meeting_type_service, reminder,
        panelist, meeting_type_link, camera_setup, status,
        additional_date_information, other_training
    } = parsedBody.data;

    const tcet_assistance = does_have_assistance.join();
    const meeting_service = meeting_type_service.join();
    const event_actual_date = DateToUTCDate(event_date);
    const dryRunDate = dry_run_date ? DateToUTCDate(dry_run_date) : null;


    const currentReminder = reminder ? reminder.join(',') : '';

    try {
        await db.$transaction(async (prisma) => {
            const appointment = await prisma.appointment.create({
                data: {
                    title, email, fullname, contact_person, department,
                    event_date: event_actual_date,
                    start_time,
                    end_time,
                    purpose,
                    venue,
                    does_have_dry_run,
                    dry_run_date: dryRunDate,
                    dry_run_start_time,
                    dry_run_end_time,
                    does_have_assistance: tcet_assistance,
                    name_of_assistance,
                    meeting_type_option,
                    meeting_type_service: meeting_service,
                    reminder: currentReminder,
                    panelist,
                    meeting_type_link,
                    camera_setup,
                    status, 
                    other_training
                }
            });

            await prisma.scheduleDate.create({
                data: {
                    day: event_actual_date.getUTCDate(),
                    month: event_actual_date.getMonth() + 1, // Month is zero-based, so add 1
                    year: event_actual_date.getFullYear(),
                    appointmentId: appointment.id
                }
            });

            if (additional_date_information && additional_date_information.length > 0) {
                await Promise.all(additional_date_information.map(async (data) => {
                    await prisma.additionalDates.create({
                        data: {
                            additional_date: DateToUTCDate(data.additonal_date_data),
                            additional_start: data.additonal_date_start,
                            additional_end: data.additonal_date_end,
                            additional_status: status,
                            appointmentId: appointment.id
                        }
                    });


                    const additionalInformation = DateToUTCDate(data.additonal_date_data)

                    await prisma.scheduleDate.create({
                        data: {
                            day: additionalInformation.getUTCDate(),
                            month: additionalInformation.getMonth() + 1, // Month is zero-based, so add 1
                            year: additionalInformation.getFullYear(),
                            appointmentId: appointment.id
                        }
                    });
                },

                ));

            }
        }, {
            timeout: 15000
        });



        await client.sendEmailWithTemplate({
            "From": "no-reply@tcet.tualearning.com",
            "To": email,
            "TemplateId": 37433358,
            "TemplateModel": {
                "company_email": "tcet@tua.edu.ph",
                "company_name": "TCET",
                "company_address": "275 E. Rodriguez Sr. Avenue, Quezon City, Philippines",
                "fullname": fullname,
                "title": title,
                "event_date": event_date.toDateString(),
                "start_time": start_time,
                "end_time": end_time,
                "department": department,
                "contact_person": contact_person,

                "purpose": purpose,
                "calendar_link": "https://tcet-schedule.vercel.app/"
            },
            "MessageStream": "outbound"
        });
        //end of try
    } catch (error) {
        console.error('Error creating appointment:', error);
        throw error;
    }
}