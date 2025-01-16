import { db } from "@/lib/db"
import { CurrentDateQuerySchema } from "@/schema/overview"
import { endOfDay, format, startOfDay } from "date-fns"

export async function GET(request: Request) {
   try {
    const getData = await db.appointment.findMany({
      where: {
         status: "approved"
      }
    })

    const events = getData.map((data) => ({ date: format(data.event_date, "yyyy-MM-dd") }))
    return Response.json(events)

   } catch (error) {
    console.log(error)
   }
    
}
