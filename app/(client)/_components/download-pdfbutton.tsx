'use client'
import dynamic from 'next/dynamic'
import React from 'react'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import AppointmentDocument from './appointment-document'
import { Button } from '@/components/ui/button'


const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink), {
    ssr: false,
    loading: () => <p>Loading...</p>
  })
  


const DownloadButton = ({ form }: any) => {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    return isClient ? (
        <PDFDownloadLink
            fileName="Appointment_Schedule"
            document={
                <AppointmentDocument 
                    form={form}
                />
            }
        >
            <Button
                variant="default"
                className='flex gap-2'
                type='button'
                size="sm"
            >
                <Download />
                <p>Appointment, download PDF copy</p>
            </Button>
        </PDFDownloadLink>
    ) : (
        <Loader2 className='animate-spin' />
    )
}

export default DownloadButton