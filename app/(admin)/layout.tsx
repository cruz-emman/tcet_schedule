import Navbar from '@/components/navbar'
import { SideBar } from '@/components/sidebar'
import React, { ReactNode } from 'react'

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex h-screen w-full flex-col">
      <Navbar />
      <div className='flex'>
        <div className="w-full">
          {children}
        </div>
      </div>

    </div>
  )
}

export default layout