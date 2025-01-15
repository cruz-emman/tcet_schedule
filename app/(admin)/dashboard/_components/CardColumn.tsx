import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock,  User,  Users, AlarmClockCheck, MoreVertical, UserPlus, Check, CircleDot, PanelRightCloseIcon, Printer, Trash2 } from "lucide-react"
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApprovedAppointment } from '../_actions/approved-appointment';
import { toast } from 'sonner';
import { DoneAppointment } from '../_actions/done-apppointment';
import { PendingAppointment } from '../_actions/pending-appointment';
import { CancelAppointment } from '../_actions/cancel-appointment';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';


const CardColumn = ({ data, title }: any) => {
  const { id } = data
  const router = useRouter()
  const queryClient = useQueryClient()
  const isCurrentlyApproved = data.status === 'approved';

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDoneDialog, setOpenDoneDialog] = useState(false);

  const createdAt = data.createdAt;
  const event_date = data.event_date;
  const dry_run = data.dry_run_date ?? null;
  const user = data.User

  const formattedCreatedAt = format(new Date(createdAt), "MMM dd yyyy h:mm a");
  const formattedEventDate = format(new Date(event_date), "MMM dd yyyy h:mm a");
  const formattedDryRunDate = dry_run ? format(new Date(dry_run), "MMM dd yyyy h:mm a") : null;


  const { mutate: approvedButton } = useMutation({
    mutationFn: (id: string) => ApprovedAppointment(id),
    onError: (error) => {
      toast.error('Failed to approve appointment', {
        id: "update-appointment-error"
      });
    },
    onSuccess: () => {
      toast.success(`Appointment named ${data.title} has been approve successfully 🎉`, {
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
      toast.success(`Appointment named ${data.title} has been approve successfully 🎉`, {
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
      toast.warning(`Appointment named ${data.title} has been moved to pending 🎉`, {
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
      toast.warning(`Appointment named ${data.title} has been cancel  🎉`, {
        id: "update-appointment-success"
      });
      queryClient.invalidateQueries({
        queryKey: ["data", "history"]
      });
    }
  });

  const statusColors = {
    pending: {
      border: 'border-yellow-400',
      bg: 'bg-yellow-50/40',
      text: 'text-yellow-700',
      ping: 'bg-yellow-400'
    },
    approved: {
      border: 'border-green-400',
      bg: 'bg-green-50/40',
      text: 'text-green-700',
      ping: 'bg-green-400'
    },
    done: {
      border: 'border-blue-400',
      bg: 'bg-blue-50/40',
      text: 'text-blue-700',
      ping: 'bg-blue-400'
    },
    cancel: {
      border: 'border-red-400',
      bg: 'bg-red-50/40',
      text: 'text-red-700',
      ping: 'bg-red-400'
    }
  };

  const colorSet = statusColors[data?.status as keyof typeof statusColors] || {
    border: 'border-gray-400',
    bg: 'bg-gray-50/40',
    text: 'text-gray-700',
    ping: 'bg-gray-400'
  };


  const meetingOptionStatus = {
    meeting: {
      bg: 'bg-indigo-500/40'
    },
    webinar: {
      bg: 'bg-fuchsia-500/40'
    },
    hybrid: {
      bg: 'bg-red-500/40'
    },
    documentation: {
      bg: 'bg-orange-500/40'
    },
    training: {
      bg: 'bg-emerald-500/40'
    },
    events: {
      bg: 'bg-rose-500/40'
    },
  }

  const optionColorSet = meetingOptionStatus[data?.meeting_type_option as keyof typeof meetingOptionStatus] || {
    bg: 'bg-gray-50/40'
  }



  return (
    <Card className='w-full mt-2 max-w-md overflow-hidden border-0 shadow-lg'>
      <CardHeader className={`border-l-4 px-6 py-3 ${colorSet.border} ${colorSet.bg}`}>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${colorSet.ping}`}></span>
            <span className={`relative inline-flex h-2 w-2 rounded-full ${colorSet.ping}`}></span>
          </span>
          <div className="flex justify-between items-center w-full">
            <span className={`font-medium capitalize ${colorSet.text}`}>{title}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-label="Menu">
                  <MoreVertical className="h-4 w-4 cursor-pointer" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`edit/${id}`)}>
                  <PanelRightCloseIcon className='mr-2 h-4 w-4' />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`printPDF/${id}`)}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Form
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <UserPlus className='mr-2 h-4 w-4' />
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

            {/* Alert Delete */}

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


            {/* Alert Done (Mark as complete) */}
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


          </div>
        </div>
      </CardHeader>
      <CardContent className='grid gap-6 p-6'>
        <div className='space-y-4'>
          <div className='flex items-start justify-between'>
            <div>
              <h3 className='font-semibold'>{data?.title}</h3>
              <div className='mt-1 flex items-center gap-4 text-sm text-muted-foreground'>
                <div className='flex items-center gap-1.5'>
                  <Calendar className='h-4 w-4' />
                  <span>{formattedEventDate}</span>
                </div>
                <Badge className={`${optionColorSet.bg} text-neutral-600 hover:bg-primary/20 capitalize`}>
                  {data?.meeting_type_option}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-3 rounded-lg bg-muted/30 p-4 text-sm'>

          <div className='flex items-center gap-3'>
            <Clock className='h-4 w-4 text-muted-foreground' />
            <div>
              <span className='text-muted-foreground'>Created on:</span>{" "}
              <span className='font-medium'>{formattedCreatedAt}</span>
            </div>
          </div>

          {formattedDryRunDate && (
            <div className='flex items-center gap-3 bg-blue-300/20 rounded-lg'>
              <AlarmClockCheck className='h-4 w-4 text-muted-foreground' />
              <div>
                <span className='text-muted-foreground'>Dry Run on:</span>{" "}
                <span className='font-medium'>{formattedDryRunDate}</span>
              </div>
            </div>
          )}

          <div className='flex items-center gap-3'>
            <User className='h-4 w-4 text-muted-foreground' />
            <div>
              <span className='text-muted-foreground'>Approved by:</span>{" "}
              <span className='font-medium'>{user[0]?.name}</span>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <Users className='h-4 w-4 text-muted-foreground' />
            <div>
              <span className='text-muted-foreground'>Assisted by:</span>{" "}
              <span className='font-medium'>{data?.editedBy}</span>
            </div>
          </div>


        </div>

      </CardContent>
    </Card>
  );
};

export default CardColumn;