'use client'
import { Calendar } from '@/components/ui/calendar'
import React, { useState } from 'react'
import CreateScheduleDialog from './create-schedule-dialog'
import { Button } from '@/components/ui/button'
import { isBefore, format, startOfDay, parseISO } from 'date-fns'
import { useCurrentUser } from '@/hooks/user-current-user'
import DateTimeClock from './date_time_clock'
import Image from 'next/image'
import { CalendarClock, CalendarIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { DayProps } from 'react-day-picker'

interface EventData {
  event_date: string; // Keep as string for initial data
}

interface Props {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  eventsList: any;

}



const LeftCalendar = ({ date, setDate, eventsList }: Props) => {
  const user = useCurrentUser();
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


  const hasEvent = (date: Date) => {
    return eventsList?.some((event:any) => {
      // Parse the event date string into a Date object
      const eventDate = parseISO(event.date);
      // Compare the dates using the same format
      return format(eventDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
    });
  };
  



  const isDateDisabled = (date: Date) => {
    return user
      ? isBefore(new Date(date), startOfDay(new Date()))
      : new Date(date) <= new Date();
  };

  return (
    <div className="flex flex-col justify-center gap-y-2 h-full md:h-[800px] relative">
      <p className="text-2xl font-semibold leading-none tracking-tight">Date today:</p>
      <div className="flex flex-col">
        <div className="w-full flex gap-x-2 p-4 rounded-full mb-8 border-2 text-2xl font-semibold leading-none tracking-tight">
          <CalendarClock />
          <span>{`${format(new Date(), 'MM/dd/yyyy')}`}</span>
        </div>
      </div>

      <div className="flex h-4/6 w-full items-center justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={openDialogBox}
          disabled={isDateDisabled}
          className="shadow-lg p-6 border rounded-md h-full w-full flex"
          classNames={{
            months: "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
            month: "space-y-4 w-full flex flex-col",
            table: "w-full h-full border-collapse space-y-1",
            head_row: "",
            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            row: "w-full mt-2",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
            day_range_end: "day-range-end",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
          }}
          components={{
            Day: ({ date: dayDate, ...props }: DayProps) => {
              const dateHasEvent = hasEvent(dayDate);
              const isDisabled = isDateDisabled(dayDate);
              const isSelected = date && format(date, "yyyy-MM-dd") === format(dayDate, "yyyy-MM-dd");

              const { displayMonth, ...domSafeProps } = props;
            

              return (
                <div className="relative">
                  <button
                    {...domSafeProps}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isDisabled) {
                        openDialogBox(dayDate);
                      }
                    }}
                    className={`relative h-9 w-9 text-lg rounded-md font-normal ${isDisabled
                        ? 'text-muted-foreground opacity-50 cursor-not-allowed'
                        : isSelected
                          ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground focus:bg-red-300/80 focus:text-accent-foreground'
                      }`}
                  >
                    {format(dayDate, "d")}
                    {dateHasEvent && (
                      <div className="absolute bottom-1 right-1 h-2 w-2 -translate-x-1/2 rounded-full bg-red-600" />
                    )}
                  </button>
                </div>
              );
            },
          }}
        />
      </div>
      <CreateScheduleDialog open={open} setOpen={setOpen} pickedDate={date} />
    </div>
  );
};

export default LeftCalendar;