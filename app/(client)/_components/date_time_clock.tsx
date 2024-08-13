'use client'
import { format } from 'date-fns'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'

const DateTimeClock = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date())
    
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date())
        }, 1000)
        
        return () => clearInterval(timer)
    }, [])

    return (
       <div className='flex items-center justify-center gap-'>
        
         <div className='flex flex-col items-center justify-center mt-10 '>
            <div className='text-center '>
                <p className="text-2xl font-semibold text-gray-700 mb-2">
                    {format(currentDateTime, "EEEE, MMMM d, yyyy")}
                </p>
                <p className="text-4xl font-bold text-blue-600">
                    {format(currentDateTime, "HH:mm:ss")}
                </p>
                <p className="text-lg mt-2 text-gray-500">
                    Today is {format(currentDateTime, "EEEE")}
                </p>
            </div>
        </div>
       </div>
    )
}

export default DateTimeClock