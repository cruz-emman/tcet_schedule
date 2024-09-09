'use server'

import { db } from "@/lib/db"

export async function DeleteAppointment(id:string):Promise<void>{
    try {
        await db.additionalDates.delete({
            where: {
                additonalDateId: id,
            }
        })
    } catch (error) {
        throw error
    }
}