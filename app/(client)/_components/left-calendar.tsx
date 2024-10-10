'use client'
import { Calendar } from '@/components/ui/calendar'
import React, { useEffect, useState } from 'react'
import CreateScheduleDialog from './create-schedule-dialog'
import { Button } from '@/components/ui/button'
import { isBefore, format, startOfDay } from 'date-fns'
import { useCurrentUser } from '@/hooks/user-current-user'
import DateTimeClock from './date_time_clock'
import Image from 'next/image'
import { CalendarClock, CalendarIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'


interface Props {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const LeftCalendar = ({ date, setDate }: Props) => {

  const user = useCurrentUser()
  const [open, setOpen] = useState<boolean>(false);

  const openDialogBox = (currentDate: Date | undefined) => {
    if (currentDate) {
      setDate(currentDate);
      setOpen(true);

    } else {
      setDate(currentDate);
      setOpen(false);
    }
  };


  return (

    <div className='flex flex-col  justify-center gap-y-2 h-full md:h-[800px]  relative'>
      <p className='text-lg text-left'> DATE TODAY: </p>
      <div className='flex flex-col'>
        <div className='w-full flex gap-x-2 p-4 rounded-full mb-8 border-2 text-xl font-semibold text-green-700'>
          <CalendarClock />
          <span className=''>{`${format(new Date(), 'MM/dd/yyyy')}`}</span>
        </div>


      </div>

      <div className='flex h-4/6 w-full items-center justify-center'>
        <Calendar
          mode="single"
          selected={date}
          onSelect={openDialogBox}
          //Change this according the user/ if admin, make
          //disabled={(date) => isBefore(new Date(date), startOfDay(new Date()))}
          disabled={user ? (date) => isBefore(new Date(date), startOfDay(new Date())) : (date) => new Date(date) <= new Date()}

          className="shadow-lg p-6 border rounded-md h-full w-full flex "
          classNames={{
            months:
              "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
            month: "space-y-4 w-full flex flex-col",
            table: "w-full h-full border-collapse space-y-1",
            head_row: "",
            head_cell: 'text-white w-9 font-normal text-[0.8rem] bg-green-700 border-2 border-green-700',
            row: "w-full mt-2",
            cell: 'border-2  text-center border-green-700',
            caption_label: "text-2xl font-extrabold text-green-700",
            day: 'w-full font-semibold h-full'
          }}
        />
      </div>
      <CreateScheduleDialog open={open} setOpen={setOpen} pickedDate={date} />

    </div>

  )
}

export default LeftCalendar