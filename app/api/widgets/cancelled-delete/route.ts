import { auth } from "@/auth";
import { db } from "@/lib/db";
import { endOfMonth, startOfMonth } from "date-fns";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const user = auth()

    if (!user) {
        redirect('/')
    }

    const result = await GetDeletedData()

    return Response.json(result)

}

export type GetDeletedDataReturnType = Awaited<ReturnType<typeof GetDeletedData>>

async function GetDeletedData() {
    const data = await db.appointment.count({
        where: {
            event_date: {
                gte: startOfMonth(new Date),
                lte: endOfMonth(new Date)
            },
            status: 'cancel',
            soft_delete: false
        },


    })

    const recurringdata = await db.additionalDates.count({
        where: {
            additional_date: {
                gte: startOfMonth(new Date),
                lte: endOfMonth(new Date)
            },
            additional_status: 'cancel'
        }
    })

    return data + recurringdata
}