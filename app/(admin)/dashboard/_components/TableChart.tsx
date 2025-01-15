'use client'

import { DateRangePicker } from '@/components/ui/date-range-picker'
import { MAX_DATE_RANGE_DAYS } from '@/lib'
import { differenceInDays, endOfMonth, startOfMonth } from 'date-fns'
import React, { useState } from 'react'
import { toast } from 'sonner'
import OverviewTable from './OverviewTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import KanbanView from './KanbanView'

const TableChart = () => {
  const [dateRange, setDateRange] = useState<{ from: Date, to: Date }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  })

  return (
    <div className='flex flex-col relative mx-4'>
      <DateRangePicker
        initialDateFrom={dateRange.from}
        initialDateTo={dateRange.to}
        showCompare={false}
        onUpdate={(values) => {
          const { from, to } = values.range;
          // We update the date range only if both dates are set

          if (!from || !to) return;
          if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
            toast.error(
              `The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days!`
            );
            console.log(`The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days!`)
            return;
          }
          setDateRange({ from, to });
        }}
      />
      <Tabs defaultValue="kanban" className="w-full">
        <div className='flex w-full justify-end px-4'>
          <TabsList className='mt-5'>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="table">
          <OverviewTable from={dateRange.from} to={dateRange.to} />
        </TabsContent>
        <TabsContent value="kanban">
          <KanbanView from={dateRange.from} to={dateRange.to} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TableChart