// 'use client'
// import React from 'react'
// import { BlobProvider } from '@react-pdf/renderer'
// import { Button } from '@/components/ui/button'
// import { Download } from 'lucide-react'
// import AppointmentDocument from './appointment-document'
// import { UseFormWatch } from 'react-hook-form'

// interface FormValues {
//   title: string;
//   email: string;
//   fullname: string;
// }

// interface PDFDownloadProps {
//   form: {
//     watch: UseFormWatch<FormValues>;
//   };
// }

// const PDFDownload: React.FC<PDFDownloadProps> = ({ form }) => {
//   return (
//     <BlobProvider document={<AppointmentDocument form={form} />}>
//       {({ blob, url, loading, error }) => {
//         if (loading) {
//           return (
//             <Button variant="default" className='flex gap-2' type='button' size="sm" disabled>
//               Loading document...
//             </Button>
//           )
//         }

//         if (error) {
//           return (
//             <Button variant="default" className='flex gap-2' type='button' size="sm" disabled>
//               Error loading document
//             </Button>
//           )
//         }

//         return (
//           <Button
//             variant="default"
//             className='flex gap-2'
//             type='button'
//             size="sm"
//             onClick={() => {
//               const link = document.createElement('a')
//               //@ts-ignore
//               link.href = url
//               link.download = 'Appointment_Schedule.pdf'
//               link.click()
//             }}
//           >
//             <Download />
//             <p>Appointment, download PDF copy</p>
//           </Button>
//         )
//       }}
//     </BlobProvider>
//   )
// }

// export default PDFDownload


import React from 'react';
import { BlobProvider, Document, Page, Text } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import AppointmentDocument from './appointment-document';


const PDFDownloadLink = ({ form }: any) => (
  <BlobProvider document={<AppointmentDocument form={form} />}>
    {({ url, loading, error }) => (
      loading ? 'Loading document...' :
        error ? 'Error generating PDF!' :
          <Button
            variant="outline"
            type='button'
          >
            <a href={url as string | undefined} download="appointment_copy.pdf">Download PDF</a>
          </Button>
    )}
  </BlobProvider>
);

export default PDFDownloadLink;
