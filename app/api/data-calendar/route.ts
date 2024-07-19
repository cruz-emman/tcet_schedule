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



    const result = await getSelectedDate(queryParams.data.currentDate)
    console

    return Response.json(result)
}

export type GetSelectedDateResponseType = Awaited<ReturnType<typeof getSelectedDate>>

async function getSelectedDate(currentDate: Date) {
    
    const start = startOfDay(currentDate)
    const end = endOfDay(currentDate)
    const dry_run_false = await db.appointment.findMany({
        where: {
            event_date: {
                gte: start,
                lte: end
            },
            does_have_dry_run: false,
            status: 'approved'
        },
        orderBy: {
            event_date: 'desc'
        }
    })


    const dry_run_true = await db.appointment.findMany({
        where: {
            event_date: {
                gte: start,
                lte: end
            },
            does_have_dry_run: true,
            status: 'approved'
        },
        orderBy: {
            event_date: 'desc'
        }
    })



    return {
        dry_run_false,
        dry_run_true
    }
}