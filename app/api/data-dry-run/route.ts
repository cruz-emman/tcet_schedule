import { db } from "@/lib/db"
import { CurrentDateQuerySchema } from "@/schema/overview"
import { endOfDay, startOfDay } from "date-fns"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const currentDate = searchParams.get('currentDate')
    const queryParams = CurrentDateQuerySchema.safeParse({ currentDate })

    if (!queryParams.success) {
        return Response.json(queryParams.error.message, {
            status: 400
        })
    }

    const result = await getSelectedDateDryRun(queryParams.data.currentDate)
    return Response.json(result)
}

export type GetSelectedDateResponseType = Awaited<ReturnType<typeof getSelectedDateDryRun>>

async function getSelectedDateDryRun(currentDate: Date) {
    
    const start = startOfDay(currentDate)
    const end = endOfDay(currentDate)

    
    const getData = await db.appointment.findMany({
        where:{
            dry_run_date:{
                gte: start,
                lte: end,
            },
            status: 'approved',
            does_have_dry_run: true,
        },
        orderBy: {
            event_date: 'desc'
        }
    })



    return getData
}