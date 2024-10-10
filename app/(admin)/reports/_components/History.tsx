import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Period, Services, TimeFrame } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import React, { useState, useEffect } from 'react'
import HistoryPeriodSelector from './HistoryPeriodSelector'
import { Badge } from '@/components/ui/badge'
import SkeletonWrapper from '@/components/skeleton-wrapper'
import CountUp from 'react-countup'


import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { cn } from '@/lib/utils'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { DownloadIcon } from 'lucide-react'
import * as XLSX from 'xlsx';
import { getDaysInMonth } from 'date-fns'


interface DepartmentData {
  [key: string]: number;
}




const History = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('month')
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear()

  })
  const [services, setServices] = useState<Services>("meeting")

  const historyDataQuery = useQuery({
    queryKey: ['overview', 'history', timeFrame, period, services],
    queryFn: () => fetch(`/api/result-overview?timeframe=${timeFrame}&year=${period.year}&month=${period.month}&service=${services}`)
      .then((res) => res.json())
      .then((data) => data.map((item: any) => ({
        ...item,
        pending: item.counts.pending,
        approved: item.counts.approved,
        done: item.counts.done,
        cancel: item.counts.cancel,

      })))
  });





  const zoomDataQuery = useQuery({
    queryKey: ['zoom', timeFrame, period],
    queryFn: () => fetch(`/api/export-csv?timeframe=${timeFrame}&year=${period.year}&month=${period.month}&service=${services}`)
      .then((res) => res.json())
  })


  const dataAvailable = historyDataQuery.data && historyDataQuery.data.length > 0;





  const handleExportExcel = () => {
    const data = zoomDataQuery.data.data;
    const month = zoomDataQuery.data.month;
  
    // Get the departments
    const departments = Object.keys(data);
    
    // Get the number of days in the month
    const daysInMonth = getDaysInMonth(new Date())
  
    // Create the header row
    const header: (string | number)[] = ["Department", ...Array.from({length: daysInMonth}, (_, i) => i + 1), "Department Total"];
    
    // Create the rows for each department
    const rows: (string | number)[][] = departments.map(dept => {
      const row: (string | number)[] = [dept];
      let deptTotal = 0;
      
      for (let i = 1; i <= daysInMonth; i++) {
        const value = data[dept][i.toString()] || null;
        row.push(value);
        deptTotal += value || 0;
      }
      
      row.push(deptTotal);
      return row;
    });
  
    // Calculate the sum of the AG column (index 32 if AG is the 33rd column)
    const agColumnSum = rows.slice(1, 21).reduce((sum, row) => sum + (row[32] as number || 0), 0);
    
    // Add a row for the AG column sum
    rows.push(["", ...Array(daysInMonth).fill(""), agColumnSum]);
  
    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
    
    // Set column widths
    const colWidth = 5;
    const firstColWidth = 15;
    const lastColWidth = 20;
    ws['!cols'] = [
      { wch: firstColWidth },
      ...Array(daysInMonth).fill({ wch: colWidth }),
      { wch: lastColWidth }
    ];
    
    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Departments");
    
    // Export the Excel file
    XLSX.writeFile(wb, `${month}_DEPARTMENT_REPORT.xlsx`);
  };
  


  return (
    <div className='container'>
      <h2 className='mt-12 text-3xl font-bold'>History</h2>
      <Button
        variant={"outline"} size={"sm"} className='ml-auto h-8 lg:flex' 
        onClick={handleExportExcel}
        >
        <DownloadIcon className='mr-2 h-4 w-4'
        />
        Export
      </Button>
      <Card className='col-span-12 mt-2 w-full'>
        <CardHeader className='gap-2'>
          <CardTitle className='flex justify-between'>
            <HistoryPeriodSelector
              period={period}
              setPeriod={setPeriod}
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
              services={services}
              setServices={setServices}
            />
            <div className="flex h-10 gap-2">
              <Badge variant="outline" className="flex items-center gap-2 text-sm">
                <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
                Pending
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2 text-sm">
                <div className="h-4 w-4 rounded-full bg-green-500"></div>
                Approved
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2 text-sm">
                <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                Done
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2 text-sm">
                <div className="h-4 w-4 rounded-full bg-red-500"></div>
                Cancel
              </Badge>
            </div>
          </CardTitle>
          <CardContent>
            <SkeletonWrapper isLoading={historyDataQuery.isFetching}>
              {dataAvailable && (
                <ResponsiveContainer width={"100%"} height={300}>
                  <BarChart data={historyDataQuery.data}>
                    <XAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      padding={{ left: 5, right: 5 }}
                      dataKey={(data) => {
                        const { year, month, day } = data;
                        const date = new Date(year, month, day  || 0);
                        if (timeFrame === "year") {
                          return date.toLocaleDateString("default", {
                            month: "short",
                          });
                        }
                        return date.toLocaleDateString("default", {
                          day: "2-digit",
                        });
                      }}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      domain={[0, 10]}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Bar dataKey="pending" fill="#eab308" />
                    <Bar dataKey="approved" fill="#10b981" />
                    <Bar dataKey="done" fill="#3b82f6" />
                    <Bar dataKey="cancel" fill="#ef4444" />

                    <Tooltip
                      cursor={{ opacity: 0.1 }}
                      content={(props) => (
                        <CustomToolTip {...props} />
                      )}
                    />
                  </BarChart>


                </ResponsiveContainer>
              )}
            </SkeletonWrapper>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}

export default History


function CustomToolTip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <ToolTipRow
          label="Approved"
          value={data.approved}
          bgColor="bg-emerald-500"
          textColor="text-emerald-500"
        />
        <ToolTipRow
          label="Canceled"
          value={data.cancel}
          bgColor="bg-rose-500"
          textColor="text-rose-500"
        />
        <ToolTipRow
          label="Done"
          value={data.done}
          bgColor="bg-blue-500"
          textColor="text-blue-500"
        />
        <ToolTipRow
          label="Pending"
          value={data.pending}
          bgColor="bg-amber-500"
          textColor="text-amber-500"
        />
      </div>
    </div>
  );
}
function ToolTipRow({
  label,
  value,
  bgColor,
  textColor
}: {
  label: string
  textColor: string
  bgColor: string
  value: number
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-4 w-4 rounded-full", bgColor)} />
      <div className="flex w-full justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={cn("text-sm font-bold", textColor)}>
          <CountUp
            duration={0.5}
            preserveValue
            end={value}
            decimals={0}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  )
}