'use client'

import React, { useEffect, useState } from 'react'
import LeftCalendar from './_components/left-calendar'
import { GetSelectedDateResponseType } from '../api/data-calendar/route'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { DateToUTCDate } from '@/lib/helpers'
import SkeletonWrapper from '@/components/skeleton-wrapper'
import { CardEvent } from './_components/card-event'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'

const ClientDashboard = () => {
  //if nothing is selected right now, get the current date, else choose
  //const [date, setDate] = useState<Date | any>(new Date())
  const [date, setDate] = useState<Date | undefined>(undefined);

  const formatDate = (date: Date) => {
    return format(date, 'EEE MMMM dd yyyy').toLowerCase()
  }

  const selectedDate = useQuery<GetSelectedDateResponseType>({
    queryKey: ['data', 'history', date],
    //@ts-ignore
    queryFn: () => fetch(`/api/data-calendar?currentDate=${date.toISOString()}`).then((res) => res.json()),
    enabled: !!date,

  })




  const dry_run_false = selectedDate.data?.dry_run_false
  const dry_run_true = selectedDate.data?.dry_run_true




  return (
    <div className="w-full px-8 ">
      <div className="flex flex-col mt-2 md:flex-row gap-2  ">
        <div className="flex-1  w-full  ">
          <LeftCalendar setDate={setDate} date={date} />
        </div>
        <div className="flex flex-col flex-1 gap-4 p-8 shadow-md border-2  rounded-3xl">
          <p className='text-xl font-bold underline text-emerald-500'>SELECTED DAY&apos;S AGENDA  {date && (<span className='capitalize'>({formatDate(date)})</span>)} </p>
          <div className='flex flex-col md:flex-row  w-full'>
            <div className="flex flex-col flex-1 w-full">
              <h1 className="text-lg font-semibold text-gray-400">Event Today</h1>
              <div className="h-full flex max-h-[650px] overflow-y-auto flex-col gap-y-2 flex-grow ">
                <SkeletonWrapper isLoading={selectedDate.isFetching}>
                  {dry_run_false?.length === 0 ? (
                    <p>No event today</p>
                  ) : (
                    <>
                      <ScrollArea>
                        {dry_run_false?.map((item, key) => (
                          <CardEvent key={key} data={item} />
                        ))}
                      </ScrollArea>
                    </>
                  )}

                </SkeletonWrapper>
              </div>
            </div>

            <div className="flex flex-col flex-1 w-full ">
              <h1 className="text-lg font-semibold  text-gray-400">Dry Run</h1>
              <div className="h-full flex max-h-[650px] bg overflow-y-auto flex-col gap-y-2 flex-grow md:min-h-[600px] min-h-full ">
                <SkeletonWrapper isLoading={selectedDate.isFetching}>
                  {dry_run_true?.length === 0 ? (
                    <p>No event today</p>
                  ) : (

                    <>
                      <ScrollArea>
                        {dry_run_true?.map((item, key) => (

                          <CardEvent key={key} data={item} />

                        ))}
                      </ScrollArea>
                    </>
                  )}

                </SkeletonWrapper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard