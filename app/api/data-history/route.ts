import { auth } from "@/auth";
import { db } from "@/lib/db";
import { OverviewQuerySchema } from "@/schema/overview";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const user = auth()

    if (!user) {
        redirect("/")
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from')
    const to = searchParams.get('to')


    const queryParams = OverviewQuerySchema.safeParse({
        from,
        to
    })


    if (!queryParams.success) {
        return Response.json(queryParams.error.message, {
            status: 400
        })
    }



    const result = await getOverViewData(
        queryParams.data.from,
        queryParams.data.to
    )
    

    return Response.json(result)
}

export type GetOverDataReponseType = Awaited<ReturnType<typeof getOverViewData>>

async function getOverViewData(from: Date, to: Date) {

    const data = await db.appointment.findMany({
        where: {
            event_date: {
                gte: from,
                lte: to
            },
            AND: [
                { soft_delete: false },
                {
                    NOT: [
                        { status: 'done' },
                        { status: 'cancel' }
                    ]

                }
            ]
        },
        orderBy: {
            event_date: 'desc'
        },
        include: {
            User: {
                select: {
                    name: true
                }
            }
        }
    })

    return data
}