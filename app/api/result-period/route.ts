import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function GET(request:Request){
  const user = await auth()
  if(!user){
    redirect('/')
  }  
  const periods = await getHistoryPeriods()
  return Response.json(periods)
}

export type getHistoryPeriodsResponseType = Awaited<ReturnType<typeof getHistoryPeriods>>


async function getHistoryPeriods(){
    const result = await db.scheduleDate.findMany({
        select: {
            year: true
        },
        distinct: ['year'],
        orderBy: [
            {year: 'asc'}
        ]
    })   

    const years = result.map((el) => el.year);
    if(years.length === 0){
        return [new Date().getFullYear()]
    }

    return years
}