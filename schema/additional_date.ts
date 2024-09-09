import {z} from 'zod'


export const AdditionalDataSchema = z.object({
    appointmentId: z.string(),
    additional_date: z.coerce.date(),
    additional_start: z.string(),
    additional_end: z.string(),
    additional_status: z.string(),
})

export type AdditionalDataSchemaType = z.infer<typeof AdditionalDataSchema> 