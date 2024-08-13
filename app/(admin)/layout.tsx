

import { auth } from '@/auth'
import Navbar from '@/components/navbar'
import { SideBar } from '@/components/sidebar'
import SkeletonWrapper from '@/components/skeleton-wrapper'
import React, { ReactNode } from 'react'
import { Suspense } from 'react'

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
  </div>
)

const AuthenticatedLayout = async ({ children }: { children: ReactNode }) => {
  const user = await auth()
  return (
    <div className="flex h-screen w-full flex-col">
    <Navbar />   
    <div className='flex flex-1 '>
      <SideBar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  </div>
  )
}

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthenticatedLayout>
        {children}
      </AuthenticatedLayout>
    </Suspense>
  )
}

export default Layout