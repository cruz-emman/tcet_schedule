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
import { CardEventDryRun } from './_components/card-event-dryrun'
import LeftCalendarUpdated from './_components/left-calendar-updated'

const ClientDashboard = () => {
  //if nothing is selected right now, get the current date, else choose
  //const [date, setDate] = useState<Date | any>(new Date())
  const [date, setDate] = useState<Date | undefined>(undefined);

  const formatDate = (date: Date) => {
    return format(date, 'EEE,  MMMM, dd yyyy').toLowerCase()
  }

  const selectedDate = useQuery<GetSelectedDateResponseType>({
    queryKey: ['data', 'history', date],
    //@ts-ignore
    queryFn: () => fetch(`/api/data-calendar?currentDate=${date.toISOString()}`).then((res) => res.json()),
    enabled: !!date,
    
  })

  
  const selectedDateDryRun = useQuery<GetSelectedDateResponseType>({
    queryKey: ['data', 'history', 'dryRun', date],
    //@ts-ignores
    queryFn: () => fetch(`/api/data-dry-run?currentDate=${date.toISOString()}`).then((res) => res.json()),
    enabled: !!date,
  })
  

  
  const listOfSelectedEvent = useQuery({
    queryKey: ['list'],
    //@ts-ignores
    queryFn: () => fetch(`/api/data-calendar-circle`).then((res) => res.json()),
  })

 


  return (
    <div className="w-full px-8 ">
      <div className="flex flex-col mt-2 md:flex-row gap-2  ">
        <div className="flex-1  w-full  ">
          <LeftCalendar setDate={setDate} date={date} eventsList={listOfSelectedEvent.data} />
        </div>
        <div className="flex flex-col flex-1 gap-4 p-8 shadow-md border-2  rounded-3xl">
          <p className='text-2xl font-semibold leading-none tracking-tight'>Event for {date && (<span className='capitalize'>({formatDate(date)})</span>)} </p>
          <div className='flex flex-col md:flex-row  w-full'>
            <div className="flex flex-col flex-1 w-full">
              <h1 className="text-lg font-semibold text-gray-400">Event Today</h1>
              <div className="h-full flex max-h-[650px] overflow-y-auto flex-col gap-y-2 flex-grow ">
                <SkeletonWrapper isLoading={selectedDate.isFetching}>
                  {selectedDate.data?.length === 0 ? (
                    <p>No event today</p>
                  ) : (
                    <>
                      <ScrollArea>
                        {selectedDate.data?.map((item, key) => (
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
                <SkeletonWrapper isLoading={selectedDateDryRun.isFetching}>


                  {selectedDateDryRun.data?.length === 0 ? (
                    <p className=''>No event today</p>
                  ) : (
                    <>
                      <ScrollArea>
                        {selectedDateDryRun.data?.map((item, key) => (
                          <CardEventDryRun key={key} data={item} />
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