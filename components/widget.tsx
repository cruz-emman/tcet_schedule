'use client'

import React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GetApprovedDataReturnType } from '@/app/api/widgets/approved/route';
import { GetpendingDataReturnType } from '@/app/api/widgets/pendings/route';
import { GetDoneDataReturnType } from '@/app/api/widgets/completed/route';
import { GetDeletedDataReturnType } from '@/app/api/widgets/cancelled-delete/route';
import SkeletonWrapper from './skeleton-wrapper';

const Widgets = () => {

    const queryClient = useQueryClient()

    const approvedData = useQuery<GetApprovedDataReturnType>({
        queryKey: ['approved'],
        queryFn: () => fetch(`/api/widgets/approved`).then((res) => res.json())
    })

    const pendingData = useQuery<GetpendingDataReturnType>({
        queryKey: ['pendings'],
        queryFn: () => fetch(`/api/widgets/pendings`).then((res) => res.json())
    })

    const doneData = useQuery<GetDoneDataReturnType>({
        queryKey: ['done'],
        queryFn: () => fetch(`/api/widgets/completed`).then((res) => res.json())
    })
    
    const cancelData = useQuery<GetDeletedDataReturnType>({
        queryKey: ['cancel'],
        queryFn: () => fetch(`/api/widgets/cancelled-delete`).then((res) => res.json())
    })
    
    queryClient.invalidateQueries({
        queryKey: ["data", "history"]
      });

    


    return (
        <SkeletonWrapper isLoading={approvedData.isFetching || pendingData.isFetching || doneData.isFetching || cancelData.isFetching}>
            <div className=" flex-col md:flex w-full">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Completed Events this month
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{doneData.data}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Pending Request This Month
                                </CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground"
                                >
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{pendingData.data}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Approved events this month
                                </CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground"
                                >
                                    <rect width="20" height="14" x="2" y="5" rx="2" />
                                    <path d="M2 10h20" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{approvedData.data}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Cancelled Events
                                </CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground"
                                >
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{cancelData.data}</div>
                            </CardContent>
                        </Card>
                    </div>
                    
                </div>
            </div>
        </SkeletonWrapper>
    )
}

export default Widgets