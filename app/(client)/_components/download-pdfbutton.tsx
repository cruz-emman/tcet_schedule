'use client'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

const PDFDownload = dynamic(
  () => import('./pdf-download-component'),
  { 
    loading: () => <Loader2 className='animate-spin' />,
    ssr: false
  }
)

const DownloadButton = ({ form }: any) => {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true)
    }, 3000) // 3 seconds delay

    return () => clearTimeout(timer) // Cleanup timer on component unmount
  }, [])

  return (
    <>
      {showButton ? (
        <PDFDownload form={form} />
      ) : (
        <>
        <Loader2 className='animate-spin' />
        <p>Kindly wait, we're generating your pdf copy...</p>
        </>
        
      )}
    </>
  )
}

export default DownloadButton
