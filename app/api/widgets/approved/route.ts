import { auth } from "@/auth";
import { db } from "@/lib/db";
import { endOfMonth, startOfMonth } from "date-fns";
import { redirect } from "next/navigation";

export async function GET(request: Request){
    const user = auth()
    
    if(!user){
        redirect('/')
    }

    const result = await GetApprovedData()

    return Response.json(result)
    
}

export type GetApprovedDataReturnType = Awaited<ReturnType<typeof GetApprovedData>>

async function GetApprovedData(){
    const data = await db.appointment.count({
        where: {
            event_date: {
                gte: startOfMonth(new Date),
                lte: endOfMonth(new Date)
            },
           status: 'approved',
           soft_delete: false
        },
        
       
    })

    return data
}