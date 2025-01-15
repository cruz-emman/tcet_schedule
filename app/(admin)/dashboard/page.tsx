import Widgets from '@/components/widget'
import React from 'react'
import TableChart from './_components/TableChart'

const AdminDashboard = async () => {



  return (
    <div className='relative w-full h-full'>
      <div className='flex flex-col gap-y-2'>
        <>
          <Widgets />
        </>
        <>
          <TableChart />
        </>
      </div>
    </div>
  )
}

export default AdminDashboard