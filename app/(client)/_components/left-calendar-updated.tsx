"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { addDays, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface Event {
  id: string
  title: string
  date: Date
  startTime: string
  endTime: string
  status: "reserved" | "available" | "cancelled"
  description?: string
}

// Sample events data
const events: Event[] = [
  {
    id: "1",
    title: "TCET Session",
    date: new Date(2024, 10, 29), // November 29, 2024
    startTime: "07:00 AM",
    endTime: "08:00 AM",
    status: "reserved",
    description: "Technical training session"
  },
  {
    id: "2",
    title: "Dry Run",
    date: new Date(2024, 10, 29),
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    status: "available",
    description: "Project dry run presentation"
  }
]

export default function LeftCalendarUpdated({date, setDate}: any) {
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  // Generate calendar days
  const generateDays = () => {
    const start = startOfWeek(startOfMonth(currentMonth))
    const days = []
    for (let i = 0; i < 35; i++) {
      days.push(addDays(start, i))
    }
    return days
  }

  // Filter events for selected date
  const selectedDateEvents = events.filter((event) => isSameDay(event.date, selectedDate))

  return (
    <div className="flex flex-col gap-4 p-4 md:flex-row">
      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Calendar</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-[120px] text-center font-medium">
                {format(currentMonth, "MMMM yyyy")}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            {generateDays().map((date, index) => {
              const hasEvents = events.some((event) => isSameDay(event.date, date))
              return (
                <Button
                  key={index}
                  variant={isSameDay(date, selectedDate) ? "default" : "ghost"}
                  className={`h-10 w-full ${
                    !isSameMonth(date, currentMonth) ? "text-muted-foreground opacity-50" : ""
                  } ${isToday(date) ? "border-2 border-primary font-bold" : ""}`}
                  onClick={() => setSelectedDate(date)}
                >
                  <span className="relative">
                    {format(date, "d")}
                    {hasEvents && (
                      <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Events for {format(selectedDate, "MMMM d, yyyy")}</CardTitle>
          <CardDescription>
            {selectedDateEvents.length
              ? `${selectedDateEvents.length} events scheduled`
              : "No events scheduled"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {selectedDateEvents.length === 0 ? (
              <div className="flex h-[450px] items-center justify-center text-muted-foreground">
                No events scheduled for this date
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            event.status === "reserved"
                              ? "bg-primary/10 text-primary"
                              : event.status === "available"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {event.startTime} - {event.endTime}
                        </span>
                      </div>
                      {event.description && (
                        <>
                          <Separator className="my-2" />
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}