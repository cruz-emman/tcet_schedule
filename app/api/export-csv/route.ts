import { db } from "@/lib/db";
import { Period, Services, TimeFrame } from "@/lib/types";
import { getDaysInMonth } from "date-fns";
import { z } from "zod";

const getHistoryDataSchema = z.object({
  timeframe: z.enum(['month', 'year']),
  month: z.coerce.number().min(0).max(11).default(0),
  year: z.coerce.number().min(2000).max(3000),
  services: z.enum(["all", "meeting", "webinar", "hybrid", "documentation", "training", "events"])
});


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const timeframe = searchParams.get('timeframe')
  const year = searchParams.get('year')
  const month = searchParams.get('month')
  const services = searchParams.get('service') as Services;


  const queryParams = getHistoryDataSchema.safeParse({
    timeframe,
    year,
    month,
    services
  });

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400
    });
  }

  try {
    const data = await getZoomReportData(
      queryParams.data.timeframe,
      {
        month: queryParams.data.month,
        year: queryParams.data.year
      },
      queryParams.data.services,

    )

    return Response.json(data)
  } catch (error) {
    return Response.json(error)
  }

}


async function getZoomReportData(
  timeframe: TimeFrame, period: Period, services: Services,
) {
  switch (timeframe) {
    // case "year":
    //   return getYearZoomData(period.year)
    case "month":
      return await getMonthZoomData(period.year, period.month, services)
  }
}


interface HistoryData {
  year: number; 
  month: number;
  day?: number;
  counts?: DepartmentCounts;
}

interface DepartmentCounts {
  ACCOUNTING: number;
  AIRGEO: number;
  BAMO: number;
  CAHS: number;
  CASE: number;
  CEIS: number;
  CHAPLAIN: number;
  CMT: number;
  GSO: number;
  HRMO: number;
  ICTO: number;
  MDO: number;
  MIO: number;
  OAR: number;
  OP: number;
  OVF: number;
  OVPSPILL: number;
  PRPODMU: number;
  PRPOEMU:number;
  QASMO: number;
  SAC: number;
  SLCN:number;
  TCET:number;
  TCCD: number;
  TGCC: number;
  TOUA: number;
  TUAIBAM: number;
  TUALIBRARY: number;
  URDC: number

}


// async function getYearZoomData(year: number) {

// }
const statusFilters = ['done', 'cancel']; // List of statuses to include

async function getMonthZoomData(year: number, month: number, services: Services) {
  const departments = [
    "ACCOUNTING",
    "AIRGEO",
    "BAMO",
    "CAHS",
    "CASE",
    "CEIS",
    "CHAPLAIN",
    "CMT",
    "GSO",
    "HRMO",
    "ICTO",
    "MDO",
    "MIO",
    "OAR",
    "OP",
    "OVF",
    "OVPSPILL",
    "PRPODMU",
    "PRPOEMU",
    "QASMO",
    "SAC",
    "SLCN",
    "TCET",
    "TCCD",
    "TGCC",
    "TOUA",
    "TUAIBAM",
    "TUALIBRARY",
    "URDC",
  ]

  const results = await Promise.all(
    departments.map(department =>
      db.scheduleDate.groupBy({
        by: ['day'],
        where: {
          year,
          month: month + 1,
          soft_delete_scheduleDate: false,
          appointment: {
            soft_delete: false,
            department,
            ...(services !== 'all' && { meeting_type_option: services }),
            status: {
              in: statusFilters
            },
            additonalDates: {

            }
          },
        },
        orderBy: [{ day: 'asc' }],
        _count: { _all: true },
      })
    )
  );

  const daysInMonth1 = getDaysInMonth(new Date(year, month))
  const departmentCounts: Record<string, Record<number, number>> = {};
  departments.forEach(department => {
    departmentCounts[department] = {};
  });

  for (let day = 0; day <= daysInMonth1; day++) {
    departments.forEach((department, index) => {
      const dayData = results[index].find(item => item.day === day);
      departmentCounts[department][day ] = dayData ? dayData._count._all : 0;
    });
  }

  return {
    month: new Date(year, month).toLocaleString('default', { month: 'long' }),
    data: departmentCounts
  };

}