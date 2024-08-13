import { db } from "@/lib/db";
import { Period, TimeFrame } from "@/lib/types";
import { z } from "zod";

const getHistoryDataSchema = z.object({
  timeframe: z.enum(['month', 'year']),
  month: z.coerce.number().min(0).max(11).default(0),
  year: z.coerce.number().min(2000).max(3000)
})


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const timeframe = searchParams.get('timeframe')
  const year = searchParams.get('year')
  const month = searchParams.get('month')

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
    const data = await getZoomReportData(
      queryParams.data.timeframe, {
      month: queryParams.data.month,
      year: queryParams.data.year
    }
    )

    return Response.json(data)
  } catch (error) {
    return Response.json(error)
  }

}


async function getZoomReportData(
  timeframe: TimeFrame, period: Period
) {
  switch (timeframe) {
    case "year":
      return getYearZoomData(period.year)
    case "month":
      return await getMonthZoomData(period.year, period.month)
  }
}


interface HistoryData {
  year: number;
  month: number;
  day?: number;
  counts?: DepartmentCounts;
}

interface DepartmentCounts {
  CAHS: number;
  CASE: number;
  CBMA: number;
  CEIS: number;
  CHTM: number;
  CMT: number;
  SLCN: number;
  THS: number;
  AIRGEO: number;
  CHAPLAIN: number;
  TGCC: number;
  OAR: number;
  OP: number;
  OSMA: number;
  PRPO: number;
  SAC: number;
  URDC: number;
  VPAA: number;
}


async function getYearZoomData(year: number) {

}

async function getMonthZoomData(year: number, month: number) {
  const departments = ['CAHS', 'CASE', 'CBMA', 'CEIS', 'CHTM', 'CMT', 'SLCN', 'THS', 'AIRGEO', 'CHAPLAIN', 'TGCC', 'OAR', 'OP', 'OSMA', 'PRPO', 'SAC', 'URDC', 'VPAA']

  const results = await Promise.all(
    departments.map(department =>
      db.scheduleDate.groupBy({
        by: ['day'],
        where: {
          year,
          month,
          soft_delete_scheduleDate: false,
          appointment: {
            soft_delete: false,
            department
          }
        },
        orderBy: [{ day: 'asc' }],
        _count: { _all: true },
      })
    )
  );

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const departmentCounts: Record<string, Record<number, number>> = {};
  departments.forEach(department => {
    departmentCounts[department] = {};
  });

  for (let day = 1; day <= daysInMonth; day++) {
    departments.forEach((department, index) => {
      const dayData = results[index].find(item => item.day === day);
      departmentCounts[department][day + 1] = dayData ? dayData._count._all : 0;
    });
  }

    return {
    month: new Date(year, month).toLocaleString('default', { month: 'long' }),
    data: departmentCounts
  };



}