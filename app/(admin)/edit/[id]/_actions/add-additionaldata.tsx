'use server'

import { db } from "@/lib/db"
import { AdditionalDataSchema, AdditionalDataSchemaType } from "@/schema/additional_date"

export async function AddAditionalData(data:AdditionalDataSchemaType, id:string):Promise<void>{
    
    const parsedBody  = AdditionalDataSchema.safeParse(data)
    if(!parsedBody.success){
        throw new Error(parsedBody.error.message)
    }
    
    const {additional_date, additional_start, additional_end, additional_status } = parsedBody.data

    try {
        await db.additionalDates.create({
            data: {
                appointmentId: id,
                additional_date,
                additional_start,
                additional_end,
                additional_status
            }
        })
    } catch (error) {
        throw error
    }
}