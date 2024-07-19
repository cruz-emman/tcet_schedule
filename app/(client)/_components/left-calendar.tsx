'use client'
import { Calendar } from '@/components/ui/calendar'
import React, { useEffect, useState } from 'react'
import CreateScheduleDialog from './create-schedule-dialog'
import { Button } from '@/components/ui/button'
import { isBefore, isToday, startOfDay } from 'date-fns'
import { useCurrentUser } from '@/hooks/user-current-user'


interface Props {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const LeftCalendar = ({date, setDate}: Props) => {

  const user = useCurrentUser()
  const existingUser = !!user



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
    <div className='flex flex-col gap-y-2 h-full md:h-[800px] '>
      <CreateScheduleDialog open={open} setOpen={setOpen} pickedDate={date} />
      <Calendar
        mode="single"
        selected={date}
        onSelect={openDialogBox}
        //Change this according the user/ if admin, make
        //disabled={(date) => isBefore(new Date(date), startOfDay(new Date()))}
        disabled={user ? (date) => isBefore(new Date(date), startOfDay(new Date())) : (date) => new Date(date) <= new Date()}

        className="shadow border rounded-md h-full w-full flex "
        classNames={{
          months:
            "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
          month: "space-y-4 w-full flex flex-col",
          table: "w-full h-full border-collapse space-y-1",
          head_row: "",
          row: "w-full mt-2",
        }}
      />
    </div>

  )
}

export default LeftCalendar