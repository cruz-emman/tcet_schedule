import { z } from "zod";


export const CreateAppointmentSchema = z.object({
  title: z.string().min(2, {
    message: "title must be at least 2 characters.",
  }),
  email: z.string().min(2, {
    message: "email must be at least 2 characters.",
  }).email(),
  fullname: z.string().min(2, {
    message: "The person who schedule the event",
  }),
  contact_person: z.string().min(2, {
    message: "Contact Person / Event Handler"
  }),
  department: z.string().min(2, {
    message: "department  must be at least 2 characters.",
  }),


  //SET 2
  event_date: z.coerce.date(),
  start_time: z.string().min(2, {
    message: "Starting time must be set.",
  }),
  end_time: z.string().min(2, {
    message: "ending time must be set.",
  }),
  venue: z.string().optional().nullable(),
  purpose: z.string().min(2, {
    message: "Please choose a purpose of the meeting.",
  }),


  // //SET 3
  does_have_dry_run: z.boolean({
    required_error: "Please select if yes or no"
  }),
  dry_run_date: z.coerce.date().optional(),
  dry_run_start_time: z.string().optional(),
  dry_run_end_time: z.string().optional(),
  does_have_assistance: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Please select at least on the option'
  }),
  name_of_assistance: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email address")
    })
  ).optional(),

  //   //set 4

  meeting_type_option: z.enum(['meeting', 'webinar', 'hybrid', 'documentation', 'training', 'events']),
  meeting_type_service: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Please select at lease on the option'
  }),
  reminder: z.array(z.string()).optional().default([]),


  panelist: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email address")
    })
  ).optional(),
  meeting_type_link: z.string().optional(),
  camera_setup: z.string().optional(),
  status: z.enum(['approved', 'pending', 'cancel', 'done']).default('pending')
})
  .superRefine(({
    does_have_dry_run,
    dry_run_date,
    dry_run_start_time,
    dry_run_end_time,
    does_have_assistance,
    name_of_assistance,
    meeting_type_service,
    meeting_type_link,
    meeting_type_option,
    camera_setup,
    panelist,
    reminder
  }, ctx) => {
    if (does_have_dry_run === true) {
      if (!dry_run_date) {
        ctx.addIssue({
          code: 'custom',
          message: 'Please provide information in the missing field.',
          path: ['dry_run_date']
        })
      }
      if (!dry_run_start_time) {
        ctx.addIssue({
          code: 'custom',
          message: 'Please provide information in the missing field.',
          path: ['dry_run_start_time']
        })
      }
      if (!dry_run_end_time) {
        ctx.addIssue({
          code: 'custom',
          message: 'Please provide information in the missing field.',
          path: ['dry_run_end_time']
        })
      }
    }

    if (does_have_assistance.includes('others')) {
      if (!name_of_assistance) {
        ctx.addIssue({
          code: 'custom',
          message: 'Please provide information in the missing field, or uncheck "others" ',
          path: ['name_of_assistance']
        })
      }
    }

    if (meeting_type_service.includes('webinar_panelist')) {
      if (!panelist) {
        ctx.addIssue({
          code: 'custom',
          message: 'Please provide information in the missing field. or unceheck panelist',
          path: ['panelist']
        })
      }
    }
    if (meeting_type_service.includes('webinar_reminder')) {
      if (reminder.length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Please select at least one reminder option.',
          path: ['reminder']
        })
      }
    }

    if (meeting_type_option === 'hybrid') {
      if (!camera_setup) {
        ctx.addIssue({
          code: 'custom',
          message: "Please provide information in the missing field",
          path: ['camera_setup']
        })
      }
    }



    if ((meeting_type_service.includes('meeting_livestream') || meeting_type_service.includes('hybrid_livestreaming') || meeting_type_service.includes('webinar_livestreaming') || meeting_type_service.includes('documentation_livestreaming') || meeting_type_service.includes('events_livestreaming'))) {
      if (!meeting_type_link) {
        ctx.addIssue({
          code: 'custom',
          message: 'Please provide information in the missing field.',
          path: ['meeting_type_link']
        })
      }
    }

    if ((meeting_type_service.includes('meeting_hybrid') || meeting_type_service.includes('webinar_hybrid'))) {
      if (!camera_setup) {
        ctx.addIssue({
          code: "custom",
          message: "Please provide meesing link",
          path: ['camera_setup']
        })
      }
    }

  });

export type CreateAppointmentSchemaType = z.infer<typeof CreateAppointmentSchema>

