'use client'

import React, { useState } from 'react'
import { DateToUTCDate } from '@/lib/helpers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ColumnDef,
  ColumnFilter,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { GetOverDataReponseType } from '@/app/api/data-history/route';
import SkeletonWrapper from '@/components/skeleton-wrapper';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { DataTableViewOptions } from '@/components/datatable/ColumnToggle';
import { DataTableFacetedFilter } from '@/components/datatable/FacetedFilter';
import { MeetingTypeOption, ResultOption, StatusOption } from '@/lib/data';
import { download, generateCsv, mkConfig } from 'export-to-csv'
import { Check, CircleDot, DownloadIcon, MoreHorizontal, PanelRightCloseIcon, Trash2, UserPlus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AlertDialogAction, AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import { DoneAndCancelDataReponseType } from '@/app/api/done-cancel-result/route';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


interface Props {
  from: Date;
  to: Date;
}


type OverviewTableRow = GetOverDataReponseType[0]

const columns: ColumnDef<OverviewTableRow>[] = [
  {
    accessorKey: "event_date",
    header: "Date",
    cell: ({ row }) => {
      const res = row.getValue('event_date')
      //@ts-ignore
      const formattedDate = format(new Date(res), "MMMM d, yyyy");
      return <div>{formattedDate}</div>
    }
  },
  {
    accessorKey: "title",
    header: "Title"
  },
  {
    accessorKey: "does_have_dry_run",
    header: "Dry Run",
    cell: ({ row }) => {
      const res = row.getValue('does_have_dry_run')
      return <div>{res === true ? 'Yes' : 'No'}</div>
    }
  },
  {
    accessorKey: "User",
    header: "Approved by",
    cell: ({ row }) => {
      const user = row.original.User
      return <div>{user.length !== 0 ? user[0].name : ""}</div>
    }
  },
  {
    accessorKey: "meeting_type_option",
    header: "Type",
    cell: ({ row }) => {
      const status = MeetingTypeOption.find(
        (status) => status.value === row.getValue("meeting_type_option")
      )

      if (!status) {
        return null
      }

      const type = row.original.meeting_type_option
      return (
        //@ts-ignore
        <Badge variant={type} className={cn('flex w-[120px] justify-center text-sm',)}>
         {status.label} 
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = ResultOption.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      
      return (
        <Badge variant="outline" className="flex w-[100px] items-center gap-2 text-sm">
          <div className={cn(`h-4 w-4 rounded-full  `, status.badgeColor)}>
          </div>
          {status.label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "editedBy",
    header: "Assited By",
    cell: ({row}) => {
      return (
        <>{row.original.editedBy}</>
      )
    }


  },

]


const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true
})

const handleExportCsv = (data: any[]) => {
  const csv = generateCsv(csvConfig)(data);
  download(csvConfig)(csv)
}

const emptyData: any[] = []

const ResultTable = ({ from, to }: Props) => {

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const history = useQuery<DoneAndCancelDataReponseType>({
    queryKey: ['data', 'history', from, to],
    queryFn: () => fetch(`/api/done-cancel-result?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then((res) => res.json())
  })



  const table = useReactTable({
    data: history.data || emptyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageSize: 2
      }
    },
    state: {
      sorting,
      columnFilters
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })




  return (
    <div className='w-full '>
      <div className='flex flex-wrap items-end justify-between gap-2 py-4'>
        <div className='flex gap-2'>
          {table.getColumn('status') && (
            <DataTableFacetedFilter title="Status" column={table.getColumn('status')} options={ResultOption} />
          )}
          {table.getColumn('meeting_type_option') && (
            <DataTableFacetedFilter title="Type" column={table.getColumn('meeting_type_option')} options={MeetingTypeOption} />
          )}
        </div>
        <div className='flex flex-wrap gap-2'>
          <DataTableViewOptions table={table} />
        
        </div>
      </div>
      <SkeletonWrapper isLoading={history.isFetching}>
        <div className="rounded-md border ">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </SkeletonWrapper>
    </div>
  )
}

export default ResultTable