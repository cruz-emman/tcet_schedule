import { auth } from "@/auth";
import { db } from "@/lib/db";
import { endOfMonth, startOfMonth } from "date-fns";
import { redirect } from "next/navigation";

export async function GET(request: Request){
    const user = auth()
    
    if(!user){
        redirect('/')
    }

    const result = await GetDoneData()

    return Response.json(result)
    
}

export type GetDoneDataReturnType = Awaited<ReturnType<typeof GetDoneData>>

async function GetDoneData(){
    const data = await db.appointment.count({
        where: {
            event_date: {
                gte: startOfMonth(new Date),
                lte: endOfMonth(new Date)
            },
           status: 'done',
           soft_delete: false
        },
        
       
    })

    return data
}