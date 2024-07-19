'use server'

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"




export async function GET(request: Request, { params }: { params: { id: string } }) {
    const session = auth()

    if (!session) {
        redirect("/")
    }



    try {
        const id = params.id;
        const result = await getSingleData(id);
        return Response.json(result);

    } catch (error) {
        return Response.json({ message: "Schedule is not existing.." })

    }

}

export type GetSingleDataResponseType = Awaited<ReturnType<typeof getSingleData>>

async function getSingleData(id: string) {
    const sched = await db.appointment.findUnique({
        where: {
            id: id
        }
    })

    return sched

}