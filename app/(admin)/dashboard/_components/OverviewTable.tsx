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
import { MeetingTypeOption, StatusOption } from '@/lib/data';
import { download, generateCsv, mkConfig } from 'export-to-csv'
import { Ban, Check, CircleDot, Cross, DownloadIcon, MoreHorizontal, PanelRightCloseIcon, Printer, Trash2, UserPlus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { ApprovedAppointment } from '../_actions/approved-appointment';
import { toast } from 'sonner';
import { PendingAppointment } from '../_actions/pending-appointment';
import { AlertDialogCancel, AlertDialogAction, AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { SoftDeleteAppointment } from '../_actions/softdelete-appointment';
import { DoneAppointment } from '../_actions/done-apppointment';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CancelAppointment } from '../_actions/cancel-appointment';


interface Props {
  from: Date;
  to: Date;
}


type OverviewTableRow = GetOverDataReponseType[0]

const ActionCell = ({ row } : any) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = row.original.id;
  const isCurrentlyApproved = row.original.status === 'approved';

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDoneDialog, setOpenDoneDialog] = useState(false);

  const { mutate: approvedButton } = useMutation({
    mutationFn: (id: string) => ApprovedAppointment(id),
    onError: (error) => {
      toast.error('Failed to approve appointment', {
        id: "update-appointment-error"
      });
    },
    onSuccess: () => {
      toast.success(`Appointment named ${row.original.title} has been approve successfully 🎉`, {
        id: "update-appointment-success"
      });
      queryClient.invalidateQueries({
        queryKey: ["data", "history"]
      });
    },
  });

  const { mutate: doneAppointment } = useMutation({
    mutationFn: (id: string) => DoneAppointment(id),
    onError: (error) => {
      toast.error('Failed to approve appointment', {
        id: "update-appointment-error"
      });
    },
    onSuccess: () => {
      toast.success(`Appointment named ${row.original.title} has been approve successfully 🎉`, {
        id: "update-appointment-success"
      });
      queryClient.invalidateQueries({
        queryKey: ["data", "history"]
      });
    },
  });

  const { mutate: pendingButton } = useMutation({
    mutationFn: (id: string) => PendingAppointment(id),
    onError: (error) => {
      toast.error(`Failed to update appointment`, {
        id: "update-appointment-error"
      });
    },
    onSuccess: () => {
      toast.warning(`Appointment named ${row.original.title} has been moved to pending 🎉`, {
        id: "update-appointment-success"
      });
      queryClient.invalidateQueries({
        queryKey: ["data", "history"]
      });
    }
  });

  const { mutate: cancelAppointment } = useMutation({
    mutationFn: (id: string) => CancelAppointment(id),
    onError: (error) => {
      toast.error(`Failed to update appointment`, {
        id: "update-appointment-error"
      });
    },
    onSuccess: () => {
      toast.warning(`Appointment named ${row.original.title} has been cancel  🎉`, {
        id: "update-appointment-success"
      });
      queryClient.invalidateQueries({
        queryKey: ["data", "history"]
      });
    }
  });

  const { mutate: softDelete } = useMutation({
    mutationFn: (id: string) => SoftDeleteAppointment(id),
    onError: (error) => {
      toast.error(`Failed to update appointment`, {
        id: "update-appointment-error"
      });
    },
    onSuccess: () => {
      toast.warning(`Appointment named ${row.original.title} has been deleted permanently 🎉`, {
        id: "update-appointment-success"
      });
      queryClient.invalidateQueries({
        queryKey: ["data", "history"]
      });
    }
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push(`edit/${id}`)}>
            <PanelRightCloseIcon className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`printPDF/${id}`)}>
            <Printer className="mr-2 h-4 w-4" />
            Print Form
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Update</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {!isCurrentlyApproved ? (
                  <DropdownMenuItem onClick={() => approvedButton(id)}>
                    <Check className="mr-2 h-4 w-4 text-emerald-600" />
                    <span>Approved</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => setOpenDoneDialog(true)}>
                    <Check className="mr-2 h-4 w-4 text-emerald-600" />
                    <span>Mark as Done</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => pendingButton(id)}>
                  <CircleDot className="mr-2 h-4 w-4 text-rose-600" />
                  <span>Pending</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem onClick={() => setOpenDeleteDialog(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event and hide your data from our dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={() => cancelAppointment(id)}>
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openDoneDialog} onOpenChange={setOpenDoneDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to mark this as done?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the appointment as completed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenDoneDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={() => doneAppointment(id)}>
                Mark as Done
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};


const columns: ColumnDef<OverviewTableRow>[] = [
  {
    accessorKey: "event_date",
    header: "Date",
    cell: ({ row }) => {
      const res = row.getValue('event_date')
      //@ts-ignore
      const formattedDate = format(new Date(res), "MMMM d, yyyy");
      return <div className='text-xs font-semibold' >{formattedDate} <span className='underline'> {row.original.start_time} - {row.original.end_time}</span> </div>
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
      const dryRundate = row.original.dry_run_date
      //@ts-ignore
      const formattedDate = format(new Date(dryRundate), "MMMM d, yyyy");

      return <div className='flex gap-x-2'>
        {res === true ?
          (
            <div className='text-xs font-semibold'> {formattedDate} <span className='underline text-red-600'> {row.original.dry_run_start_time} - {row.original.dry_run_end_time}</span> </div>

          ) : 'No'}
      </div>
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
      const status = StatusOption.find(
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
    header: "Assisted By",
    cell: ({row}) => {
      return (
        <>{row.original.editedBy}</>
      )
    }


  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell row={row} />
  }
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

const OverviewTable = ({ from, to }: Props) => {

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const history = useQuery<GetOverDataReponseType>({
    queryKey: ['data', 'history', from, to],
    //queryFn: () => fetch(`/api/data-history?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then((res) => res.json())
    queryFn: () => fetch(`/api/data-history?from=${from}&to=${to}`).then((res) => res.json())
  })





  const table = useReactTable({
    data: history.data || emptyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {

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
            <DataTableFacetedFilter title="Status" column={table.getColumn('status')} options={StatusOption} />
          )}
          {table.getColumn('meeting_type_option') && (
            <DataTableFacetedFilter title="Type" column={table.getColumn('meeting_type_option')} options={MeetingTypeOption} />
          )}
        </div>
        <div className='flex flex-wrap gap-2'>
          <DataTableViewOptions table={table} />
          {/* <Button variant={"outline"} size={"sm"} className='ml-auto h-8 lg:flex' >
            <DownloadIcon className='mr-2 h-4 w-4' />
            Export CSV
          </Button> */}
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

export default OverviewTable