import { db } from "@/lib/db";
import { Period, TimeFrame } from "@/lib/types";
import { getDaysInMonth } from "date-fns";
import { z } from "zod";

const getHistoryDataSchema = z.object({
  timeframe: z.enum(['month', 'year']),
  month: z.coerce.number().min(0).max(11).default(0),
  year: z.coerce.number().min(2000).max(3000),
})


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const timeframe = searchParams.get('timeframe')
  const year = searchParams.get("year")
  const month = searchParams.get("month")


  const queryParams = getHistoryDataSchema.safeParse({
    timeframe,
    year,
    month
  })


  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400
    })
  }


  try {

    const data = await getHistoryData(
      queryParams.data.timeframe, {
      month: queryParams.data.month,
      year: queryParams.data.year
    })


    return Response.json(data)
  } catch (error) {

    return Response.json(error)
  }

}

async function getHistoryData(
  timeframe: TimeFrame,
  period: Period
) {
  switch (timeframe) {
    case "year":
      return getYearHistoryData(period.year)
    case "month":
      return await getMonthHistoryData(period.year, period.month);

  }
}

interface HistoryData {
  year: number;
  month: number;
  day?: number;
  counts?: StatusCounts;
}

interface StatusCounts {
  pending: number;
  approved: number;
  done: number;
  cancel: number;
}

async function getYearHistoryData(year: number): Promise<HistoryData[]> {
  const statuses = ['pending', 'approved', 'done', 'cancel'];
  const results = await Promise.all(
    
    statuses.map(status =>
      db.scheduleDate.groupBy({
        by: ['month'],
        where: {
          year,
          soft_delete_scheduleDate: false,
          appointment: {
            soft_delete: false,
            status
          }
        },
        orderBy: [{ month: 'asc' }],
        _count: { _all: true },
      })
    )
  );

  const history: HistoryData[] = Array.from({ length: 12 }, (_, i) => {
    const month = i ;
    const counts: StatusCounts = {
      pending: 0,
      approved: 0,
      done: 0,
      cancel: 0,
    };

    statuses.forEach((status, index) => {
      const monthData = results[index].find(item => item.month === month);
      counts[status as keyof StatusCounts] = monthData ? monthData._count._all : 0;
    });

    return { year, month, counts };
  });

  return history;
}

async function getMonthHistoryData(year: number, month: number): Promise<HistoryData[]> {
  const statuses = ['pending', 'approved', 'done', 'cancel'] as const;
  type Status = typeof statuses[number];

  const results = await Promise.all(
    statuses.map(status =>
      db.scheduleDate.groupBy({
        by: ['day'],
        where: {
          year,
          month,
          soft_delete_scheduleDate: false,
          appointment: {
            soft_delete: false,
            status
          }
        },
        orderBy: [{ day: 'asc' }],
        _count: { _all: true },
      })
    )
  );

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const history: HistoryData[] = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const counts: StatusCounts = {
      pending: 0,
      approved: 0,
      done: 0,
      cancel: 0,
    };

    statuses.forEach((status, index) => {
      const dayData = results[index].find(item => item.day === day);
      counts[status] = dayData ? dayData._count._all : 0;
    });

    return { year, month, day, counts };
  });

  return history;
}