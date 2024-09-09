import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";


export async function GET(request: Request, { params }: { params: { id: string } }) {
    const user = auth()

    if (!user) {
        redirect('/')
    }

    try {
        const result = await GetAdditonalDates(params.id);
        return Response.json(result)
    } catch (error) {
        return Response.json({ message: "Additional dates is not existing.." })
    }
}

export type GetAddtionalDatesResponseType = Awaited<ReturnType<typeof GetAdditonalDates>>

async function GetAdditonalDates(id: string) {
    const data = await db.additionalDates.findMany({
        where: {
            appointmentId: id
        }
    })


    return data || []
}