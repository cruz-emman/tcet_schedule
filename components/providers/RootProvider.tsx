'use client'

import { ThemeProvider } from 'next-themes'
import React, { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const RootProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute='class'
                defaultTheme='light'
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default RootProvider