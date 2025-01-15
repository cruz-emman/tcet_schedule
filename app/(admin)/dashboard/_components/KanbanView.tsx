'use client'
import { GetOverDataReponseType } from '@/app/api/data-history/route';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import React, { useState } from 'react'
import { Column } from './Column';
import SkeletonWrapper from '@/components/skeleton-wrapper';

interface Props {
    from: Date,
    to: Date
}

const KanbanView = ({ from, to }: Props) => {

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const history = useQuery<GetOverDataReponseType>({
        queryKey: ['data', 'history', from, to],
        //queryFn: () => fetch(`/api/data-history?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then((res) => res.json())
        queryFn: () => fetch(`/api/data-history?from=${from}&to=${to}`).then((res) => res.json())
    })


    let pendingResult = history.data?.filter((res) => res.status === 'pending')
    let approvedResult = history.data?.filter((res) => res.status === 'approved')
    let doneResult = history.data?.filter((res) => res.status === 'done')
    let cancelledResult = history.data?.filter((res) => res.status === 'cancel')





    return (
        <div className='w-full '>
            <div className='flex gap-8'>
                <SkeletonWrapper isLoading={history.isPending}>
                    <Column
                        title="Pending"
                        color="bg-yellow-500"
                        data={pendingResult || []} // Provide a fallback in case `data` is undefined
                    />
                </SkeletonWrapper>

                <SkeletonWrapper isLoading={history.isPending}>
                    <Column
                        title="Approved"
                        color="bg-green-500"
                        data={approvedResult || []} // Provide a fallback in case `data` is undefined
                    />
                </SkeletonWrapper>

                <SkeletonWrapper isLoading={history.isPending}>
                    <Column
                        title="Done"
                        color="bg-blue-500"
                        data={doneResult || []} // Provide a fallback in case `data` is undefined
                    />
                </SkeletonWrapper>

                <SkeletonWrapper isLoading={history.isPending}>
                    <Column
                        title="Deleted / Cancelled"
                        color="bg-red-500"
                        data={cancelledResult || []} // Provide a fallback in case `data` is undefined
                    />
                </SkeletonWrapper>


            </div>
        </div>
    )
}

export default KanbanView