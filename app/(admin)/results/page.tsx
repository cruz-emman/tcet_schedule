'use client'

import { DateRangePicker } from '@/components/ui/date-range-picker'
import { MAX_DATE_RANGE_DAYS } from '@/lib'
import { differenceInDays, startOfMonth } from 'date-fns'
import React, { useState } from 'react'
import { toast } from 'sonner'
import ResultTable from './_components/result-table'

const ResultTablePage = () => {
  const [dateRange, setDateRange] = useState<{ from: Date, to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date()
  })
  return (
    <div className='flex flex-col relative mx-4'>
      <p className='p-4 text-semibold text-3xl'>Done - Cancel Table</p>
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
      <div className="">
        <ResultTable from={dateRange.from} to={dateRange.to} />
      </div>
    </div>
  )
}

export default ResultTablePage