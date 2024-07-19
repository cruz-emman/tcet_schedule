import { auth } from "@/auth";
import { db } from "@/lib/db";
import { endOfMonth, startOfMonth } from "date-fns";
import { redirect } from "next/navigation";

export async function GET(request: Request){
    const user = auth()
    
    if(!user){
        redirect('/')
    }

    const result = await GetpendingData()

    return Response.json(result)
    
}

export type GetpendingDataReturnType = Awaited<ReturnType<typeof GetpendingData>>

async function GetpendingData(){
    const data = await db.appointment.count({
        where: {
            event_date: {
                gte: startOfMonth(new Date),
                lte: endOfMonth(new Date)
            },
           status: 'pending',
           soft_delete: false
        },
        
       
    })

    return data
}