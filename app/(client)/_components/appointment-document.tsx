'use client'
import React, {useState, useEffect} from 'react'
import dynamic from 'next/dynamic'
import { Document, Font, Page, Text, View } from '@react-pdf/renderer'
import { Loader2 } from 'lucide-react'
const AppointmentDocument = ({ form }: any) => {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    return isClient ? (
    //    <Document>
    //     <Page>
    //         <Text>{form.watch('title')}</Text>
    //     </Page>
    //    </Document>
    <div></div>
    ) : (
        <Loader2 className='animate-spin' />
    )
}

export default AppointmentDocument