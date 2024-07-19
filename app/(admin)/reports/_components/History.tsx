import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Period, TimeFrame } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
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

const History = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('month')
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear()

  })

  const historyDataQuery = useQuery({
    queryKey: ['overview', 'history', timeFrame, period],
    queryFn: () => fetch(`/api/result-overview?timeframe=${timeFrame}&year=${period.year}&month=${period.month}`)
      .then((res) => res.json())
      .then((data) => data.map((item: any) => ({
        ...item,
        pending: item.counts.pending,
        approved: item.counts.approved,
        done: item.counts.done,
        cancel: item.counts.cancel
      })))
  });

  const dataAvailable = historyDataQuery.data && historyDataQuery.data.length > 0;



  return (
    <div className='container'>
      <h2 className='mt-12 text-3xl font-bold'>History</h2>
      <Card className='col-span-12 mt-2 w-full'>
        <CardHeader className='gap-2'>
          <CardTitle className='flex justify-between'>
            <HistoryPeriodSelector
              period={period}
              setPeriod={setPeriod}
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
            />
            <div className="flex h-10 gap-2">
              <Badge variant="outline" className="flex items-center gap-2 text-sm">
                <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                Pending
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2 text-sm">
                <div className="h-4 w-4 rounded-full bg-green-500"></div>
                Approved
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2 text-sm">
                <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
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
                        const date = new Date(year, month, day || 1);
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
                    <Bar dataKey="pending" fill="#3b82f6" />
                    <Bar dataKey="approved" fill="#10b981" />
                    <Bar dataKey="done" fill="#f59e0b" />
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