'use client'

import SkeletonWrapper from '@/components/skeleton-wrapper';
import {
Form,
FormControl,
FormField,
FormItem,
FormLabel,
FormMessage,
} from "@/components/ui/form";
import {
Dialog,
DialogContent,
DialogFooter,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { CreateAppointmentSchema, CreateAppointmentSchemaType } from '@/schema/appointment';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { UpdateAppointment } from './_actions/update-appointment';
import { assistedBy, departmentOptions, does_have_assistance_choice, eventsChoice, hybridChoice, photoVideoChoice, purposeChoice, timeAM, timePM, trainingChoice, zoomMeetingChoice, zoomWebinarChoice } from '@/lib/data';
import SeletGroupFieldInput from '@/components/forms/select-time';
import SelectFieldInput from '@/components/forms/select-field_input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format, isBefore, startOfDay } from 'date-fns';
import { ArrowBigLeft, CalendarIcon, icons, Loader2, Plus, Trash, Trash2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdditionalField from './_components/additional_field';
import { DeleteAppointment } from './_actions/delete-additionaldata';
import { AdditionalDataSchemaType } from '@/schema/additional_date';
import { AddAditionalData } from './_actions/add-additionaldata';



interface EditPostPageProps {
params: {
  id: string;
};
}

interface Assistant {
name: string;
email: string;
}

interface AdditonalDateProps {
additonalDateId: string
additional_date: any
additional_start: string
additional_end: string
additional_status: string
appointmentId: string
}

type MeetingType = 'meeting' | 'webinar' | 'hybrid' | 'documentation' | 'training';




const EditAppointment = ({ params }: EditPostPageProps) => {


const { id } = params;
const router = useRouter()

const [assistants, setAssistants] = useState<Assistant[]>([]);
const [panelists, setPanelist] = useState<any>([])
const [newAssistant, setNewAssistant] = useState({ name: '', email: '' });
const [newPanelist, setNewPanelist] = useState({ name: '', email: '' });

const [date, setDate] = useState<Date | undefined>(undefined);


//MODALS
const [isModalOpen, setIsModalOpen] = useState(false);
const [modalPanelist, setIsModalPanelist] = useState(false)
const [modalAdditionalDate, setModalAdditionalDate] = useState(false)
const [modalSubmitButton, setModalSubmitButton] = useState(false)

const [meetingTypeSelections, setMeetingTypeSelections] = useState<Record<MeetingType, never[]>>({
  meeting: [],
  webinar: [],
  hybrid: [],
  documentation: [],
  training: []
});






const appoinment = useQuery({
  queryKey: ['appointment', 'data', 'history', id],
  queryFn: () => fetch(`/api/single-sched/${id}`).then((res) => res.json())
})

const additionalDate = useQuery({
  queryKey: ['additionalDate', 'appointment', 'data', 'history', id],
  queryFn: () => fetch(`/api/recurring-date/${id}`).then((res) => res.json())

})






const [additionalField, setAdditionalField] = useState({
  additional_date: undefined as Date | undefined, // Initialize as undefined
  additional_start: '',
  additional_end: '',
  additional_status: ''

})

const handleDateSelect = (date: Date | undefined) => {
  if (date) {
    setAdditionalField(prev => ({ ...prev, additional_date: date }));
  }
};




const handleChange = (value: string, name: string) => {
  setAdditionalField(prev => ({ ...prev, [name]: value }));
};

const { data, isLoading, error } = appoinment;


const form = useForm<CreateAppointmentSchemaType>({
  resolver: zodResolver(CreateAppointmentSchema),
  defaultValues: {
    editedBy: [],

  },
});

let watchEvent = form.watch("meeting_type_option");
let watchDoesHaveAssitance = form.watch('does_have_assistance')
let watchMeetingTypeService = form.watch('meeting_type_service')




useEffect(() => {
  if (data) {
    form.reset({
      does_have_assistance: data.does_have_assistance?.split(",") || [],
      meeting_type_service: data.meeting_type_service?.split(",") || [],
      reminder: data.reminder?.split(',') || [],
      meeting_type_option: data.meeting_type_option,
    });
    // Initialize meeting type selections with fetched data
    setMeetingTypeSelections({
      meeting: data.meeting_type_option === 'meeting' ? data.meeting_type_service?.split(",") || [] : [],
      webinar: data.meeting_type_option === 'webinar' ? data.meeting_type_service?.split(",") || [] : [],
      hybrid: data.meeting_type_option === 'hybrid' ? data.meeting_type_service?.split(",") || [] : [],
      documentation: data.meeting_type_option === 'documentation' ? data.meeting_type_service?.split(",") || [] : [],
      training: data.meeting_type_option === 'training' ? data.meeting_type_service?.split(",") || [] : []
    });
  }
  if (data?.name_of_assistance) {
    setAssistants(data.name_of_assistance);
  }
  if (data?.panelist) {
    setPanelist(data.panelist);
  }
}, [data, form]);








const queryClient = useQueryClient()


const { mutate, isPending } = useMutation({
  mutationFn: (data: { form: CreateAppointmentSchemaType; id: string }) =>
    UpdateAppointment(data.form, data.id),
  onSuccess: () => {
    toast.success('Appointment updated successfully 🎉', {
      id: "update-appointment"
    })
    router.push('/dashboard')
    queryClient.invalidateQueries({ queryKey: ["appointment"] });
  },
  onError: (error) => {
    toast.error(`Error updating appointment: ${error.message}`, {
      id: "update-appointment-error"
    })
  }
})

const { mutate: mutateAdditionalDate, isPending: isPendingAdditionalDate } = useMutation({
  mutationFn: (data: { data: AdditionalDataSchemaType, id: string }) => AddAditionalData(data.data, data.id),
  onSuccess: () => {
    toast.success("Additional Date Event has been created", {
      id: 'add-additionaldata',
    });
    queryClient.invalidateQueries({ queryKey: ['additionalDate', 'appointment', 'data', 'history', id] });

    setAdditionalField({
      additional_date: undefined,
      additional_start: '',
      additional_end: '',
      additional_status: ''
    });
  },
  onError: (error) => {
    toast.error(`Error adding appointment : ${error.message}`);
  }
});

const { mutate: DeleteAdditionalDate, isPending: deleteIsPending } = useMutation<void, Error, string>({
  mutationFn: DeleteAppointment, // Use the separate function here
  onSuccess: () => {
    toast.success("Additional Data deleted", {
      id: "deleted-additional"
    });
    queryClient.invalidateQueries({ queryKey: ['additionalDate', 'appointment', 'data', 'history', id] });
  },
  onError: (error) => {
    toast.error(`Error updating appointment: ${error.message}`, {
      id: "update-appointment-error"
    });
  }
});

const handleDelete = (id: string) => {
  // Implement deletion logic here
  DeleteAdditionalDate(id)
  console.log(`Delete item with ID: ${id}`);
};




//LOGIC FOR THE DATAS 
const handleClick = () => {
  form.setValue("dry_run_date", undefined);
  form.setValue("dry_run_start_time", "");
  form.setValue("dry_run_end_time", "");
};

const handleMeetingTypeChange = (newMeetingType: any) => {
  // Save the current meeting type service selections
  const currentMeetingType = form.getValues("meeting_type_option") as MeetingType;
  const currentMeetingTypeService = form.getValues("meeting_type_service");


  setMeetingTypeSelections(prev => ({
    ...prev,
    [currentMeetingType]: currentMeetingTypeService
  }));

  // Set new meeting type and reset services for new type
  form.setValue("meeting_type_option", newMeetingType);
  //@ts-ignore
  form.setValue("meeting_type_service", meetingTypeSelections[newMeetingType] || []);
  form.setValue("camera_setup", "");
  form.resetField("meeting_type_link");
  form.resetField("camera_setup");
};




useEffect(() => {
  form.setValue('name_of_assistance', assistants);
}, [assistants, form]);


useEffect(() => {
  form.setValue('panelist', panelists)
}, [panelists, form])



//For Panelist
const removePanelist = (name: string) => {
  setPanelist((prev: any) => prev.filter((panel: { name: string }) => panel.name !== name))
}


const addPanelist = () => {
  if (newPanelist.name && newPanelist.email) {
    setPanelist((prev: any) => [...prev, newPanelist])
    setNewPanelist({ name: '', email: '' })
  }
}



//For Assistant
const removeAssistant = (name: string) => {
  setAssistants((prev) => prev.filter((assistant: { name: string }) => assistant.name !== name));
};


const addAssistant = () => {
  if (newAssistant.name && newAssistant.email) {
    setAssistants((prev) => [...prev, newAssistant]);
    setNewAssistant({ name: '', email: '' }); // Reset the form
  }
};


//For submitting actual form
const onEdit = (values: CreateAppointmentSchemaType) => {

  const formData = {
    ...values,
    name_of_assistance: assistants,
    panelist: panelists
  };

  mutate({ form: formData, id: params.id });
}
const onError = (error: any) => {
  console.log(error)

};

const onAddAdditionalDate = () => {
  mutateAdditionalDate({
    data: {
      appointmentId: id,
      additional_date: additionalField.additional_date!,
      additional_start: additionalField.additional_start,
      additional_end: additionalField.additional_end,
      additional_status: additionalField.additional_status,
    },
    id: id,
  });
  setModalAdditionalDate(false)
};



if (isLoading && additionalDate.isLoading) {
  return (
    <div>
      Loading...
    </div>
  )
}


return (

  <div className='m-4 p-4 shadow-2xl border-2  '>
    <Button asChild className='my-2' size="sm">
      <Link href="/dashboard">
        <ArrowBigLeft />
        Back
      </Link>
    </Button>
    <SkeletonWrapper isLoading={appoinment.isLoading}>
      <Form {...form}>
        <form>
          <div className='flex flex-col gap-4'>

            {/* General Information */}
            <div className='flex flex-col gap-y-2 '>
              <p className='text-lg text-gray-400 font-semibold'>General Information</p>
              <FormField
                control={form.control}
                name="title"
                defaultValue={data?.title}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                defaultValue={data?.email}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullname"
                defaultValue={data?.fullname}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact_person"
                defaultValue={data?.contact_person}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form?.control}
                name="department"
                defaultValue={data?.department}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College / Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a college / unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departmentOptions.map((item) => (
                          <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>

                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


            {/* Date, Time and Purpose */}

            <div className='flex flex-col gap-y-2 '>
              <p className='text-lg text-gray-400 font-semibold'>Date, Time and Purpose</p>

              <FormField
                control={form.control}
                name="event_date"
                defaultValue={data?.event_date}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Event</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => isBefore(new Date(date), startOfDay(new Date()))}

                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SeletGroupFieldInput
                name="start_time"
                defaultValue={data?.start_time}
                placeholder="start of event.."
                control={form.control}
                label="Start"
              />

              <SeletGroupFieldInput
                name="end_time"
                defaultValue={data?.end_time}
                placeholder="end of event.."
                control={form.control}
                label="End"

              />
              <p className='text-sm '>Additional Dates (Ignore if not required)</p>
              {additionalDate.data?.length > 0 ? (
                <>
                  <div className='flex flex-col gap-y-4 p-4'>
                    {additionalDate.data?.map((item: AdditonalDateProps) => {
                      return (
                        <div className='flex items-center gap-x-2 mb-2' key={item.additonalDateId}>
                          <Button
                            disabled
                            variant="outline"
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            {item.additional_date ? format(item.additional_date, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                          <Select defaultValue={item.additional_start}>
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Start Time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Morning</SelectLabel>
                                  {timeAM.map((item, i) => (
                                    <SelectItem key={i} value={item.time}>
                                      {item.time}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                                <SelectGroup>
                                  <SelectLabel>Afternoon</SelectLabel>
                                  {timePM.map((item, i) => (
                                    <SelectItem key={i} value={item.time}>
                                      {item.time}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </SelectContent>
                          </Select>
                          <Select defaultValue={item.additional_end}>
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Start Time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Morning</SelectLabel>
                                  {timeAM.map((item, i) => (
                                    <SelectItem key={i} value={item.time}>
                                      {item.time}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                                <SelectGroup>
                                  <SelectLabel>Afternoon</SelectLabel>
                                  {timePM.map((item, i) => (
                                    <SelectItem key={i} value={item.time}>
                                      {item.time}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </SelectContent>
                          </Select>

                          <Select defaultValue={item.additional_status}>
                            <SelectTrigger className='w-[120px]'>
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="done">Done</SelectItem>
                              <SelectItem value="approved">Approve</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="cancel">Cancel</SelectItem>
                            </SelectContent>
                          </Select>


                          <Button
                            onClick={() => handleDelete(item.additonalDateId)}
                            variant="outline"
                            size="icon"
                            type="button"
                            className='align-self
                                '
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>

                </>
              ) : (
                <></>
              )}

              <Dialog open={modalAdditionalDate} onOpenChange={setModalAdditionalDate}>
                <DialogTrigger asChild>
                  <Button className='w-[240px] bg-orange-300/90' variant="outline">Add Additional Dates</Button>
                </DialogTrigger>
                <DialogContent className="sm:w-5/6">
                  <DialogHeader>
                    <DialogTitle>Add additional date</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col items-start justify-center gap-y-5">

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          {additionalField.additional_date ? format(additionalField.additional_date, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={additionalField.additional_date}
                          onSelect={handleDateSelect}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <Select
                      onValueChange={(value) => handleChange(value, "additional_start")}

                      name="additional_start">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Start Time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Morning</SelectLabel>
                            {timeAM.map((item, i) => (
                              <SelectItem key={i} value={item.time}>
                                {item.time}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Afternoon</SelectLabel>
                            {timePM.map((item, i) => (
                              <SelectItem key={i} value={item.time}>
                                {item.time}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </SelectContent>
                    </Select>


                    <Select
                      onValueChange={(value) => handleChange(value, "additional_end")}

                      name="additional_end">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="End Time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Morning</SelectLabel>
                            {timeAM.map((item, i) => (
                              <SelectItem key={i} value={item.time}>
                                {item.time}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Afternoon</SelectLabel>
                            {timePM.map((item, i) => (
                              <SelectItem key={i} value={item.time}>
                                {item.time}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </SelectContent>
                    </Select>

                    <Select
                      onValueChange={(value) => handleChange(value, "additional_status")}
                      name='additional_status'>
                      <SelectTrigger className='w-[120px]'>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="done">Done</SelectItem>
                        <SelectItem value="approved">Approve</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancel">Cancel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={onAddAdditionalDate}
                      disabled={isPendingAdditionalDate}
                      type="submit">Add Date</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <SelectFieldInput
                control={form.control}
                defaultValue={data?.purpose}
                name="purpose"
                label="Purpose"
                placeholder="select a purpose"
                data={purposeChoice}
                className={`w-full`}
              />

              <FormField
                control={form.control}
                name="venue"
                defaultValue={data?.venue || ""}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Venue"
                        {...field}
                        value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dry Run and Assistance */}
            <div className='flex flex-col gap-y-2 '>
              <p className='text-lg text-gray-400 font-semibold'>Dry Run and Assistance</p>
              <FormField
                control={form.control}
                name="does_have_dry_run"
                defaultValue={data?.does_have_dry_run}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Dry Run</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          const boolValue = value === "true";
                          field.onChange(boolValue);
                          if (!boolValue) {
                            handleClick();
                          }
                        }}

                        defaultValue={String(field.value)}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              onClick={handleClick}
                              value="false" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            None / No
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="true" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Yes
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>

                    {field.value === true && (
                      <FormItem>
                        <div className="flex flex-col gap-2 pt-2">
                          <Label>(Dry Run) Time of Event</Label>
                          <div className="flex flex-col gap-2">
                            <FormField
                              control={form.control}
                              defaultValue={data?.dry_run_date || null}
                              name="dry_run_date"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Date</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !field.value &&
                                            "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <Calendar
                                        mode="single"
                                        disabled={[
                                          { before: new Date() },
                                          { after: data?.event_date }
                                        ]}// Disable past dates and today's date
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <SeletGroupFieldInput
                              name="dry_run_start_time"
                              placeholder="Select time"
                              defaultValue={data?.dry_run_start_time || ""}

                              control={form.control}
                              label="Start"
                            />
                            <SeletGroupFieldInput
                              name="dry_run_end_time"
                              defaultValue={data?.dry_run_end_time || ""}
                              placeholder="Select time"
                              control={form.control}
                              label="End"
                            />


                          </div>
                        </div>
                      </FormItem>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="does_have_assistance"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        Tech Assistance
                      </FormLabel>
                    </div>
                    {does_have_assistance_choice.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="does_have_assistance"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                        ...field.value,
                                        item.id,
                                      ])
                                      : field.onChange(
                                        field.value?.filter(
                                          (value: any) =>
                                            value !== item.id
                                        )
                                      );
                                  }}
                                />
                              </FormControl>

                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchDoesHaveAssitance?.includes('others') && (
                <Table className='max-w-[400px]'>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline">Add</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Add New Assistant</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Name
                                </Label>
                                <Input
                                  id="name"
                                  value={newAssistant.name}
                                  onChange={(e) => setNewAssistant({ ...newAssistant, name: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                  Email
                                </Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={newAssistant.email}
                                  onChange={(e) => setNewAssistant({ ...newAssistant, email: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <Button onClick={addAssistant}>Add Assistant</Button>
                          </DialogContent>
                        </Dialog>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assistants.map((item: { name: string, email: string }) => (
                      <TableRow key={item.name}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              removeAssistant(item.name);
                            }}
                            variant="ghost"
                          >
                            <Trash2
                              className='h-4 w-4 text-red-700'

                            />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}


            </div>

            {/* Type of Service */}

            <div className='flex flex-col gap-y-2 '>
              <p className='text-lg text-gray-400 font-semibold'>Type Of Service</p>
              <FormField
                control={form.control}
                name="meeting_type_option"
                defaultValue={data?.meeting_type_option}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Type of Service</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        handleMeetingTypeChange(value)
                      }
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a meeting type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="meeting">
                          Zoom Meeting
                        </SelectItem>
                        <SelectItem value="webinar">
                          Zoom Webinar
                        </SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="documentation">
                          Documentation
                        </SelectItem>
                        <SelectItem value="training">
                          Training
                        </SelectItem>
                        <SelectItem value="events">
                          Events
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchEvent === "documentation" && (
                <>
                  <FormField
                    control={form.control}
                    name="meeting_type_service"
                    render={() => (
                      <FormItem>
                        {photoVideoChoice.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="meeting_type_service"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                            ...field.value,
                                            item.id,
                                          ])
                                          : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {watchEvent === "meeting" && (
                <>
                  <FormField
                    control={form.control}
                    name="meeting_type_service"
                    render={({ field }) => (
                      <FormItem>
                        {zoomMeetingChoice.map((item) => (
                          <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [...(field.value || []), item.id]
                                    : (field.value || []).filter((value) => value !== item.id);
                                  field.onChange(updatedValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
                          </FormItem>
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <AdditionalField
                    defaultValues={data}
                    control={form.control}
                    dataServices={watchMeetingTypeService}

                  />
                </>
              )}

              {watchEvent === "webinar" && (
                <>
                  <FormField
                    control={form.control}
                    name="meeting_type_service"
                    render={() => (
                      <FormItem>
                        {zoomWebinarChoice.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="meeting_type_service"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), item.id]
                                          : (field.value || []).filter((value) => value !== item.id);
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchMeetingTypeService.includes('webinar_panelist') && (
                    <>
                      <Table className='max-w-[400px]'>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>
                              <Dialog open={modalPanelist} onOpenChange={setIsModalPanelist}>
                                <DialogTrigger asChild>
                                  <Button variant="outline">Add</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Add New Panelist</DialogTitle>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="name" className="text-right">
                                        Name
                                      </Label>
                                      <Input
                                        id="name"
                                        value={newPanelist.name}
                                        onChange={(e) => setNewPanelist({ ...newPanelist, name: e.target.value })}
                                        className="col-span-3"
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="email" className="text-right">
                                        Email
                                      </Label>
                                      <Input
                                        id="email"
                                        type="email"
                                        value={newPanelist.email}
                                        onChange={(e) => setNewPanelist({ ...newPanelist, email: e.target.value })}
                                        className="col-span-3"
                                      />
                                    </div>
                                  </div>
                                  <Button onClick={addPanelist}>Add Panelist</Button>
                                </DialogContent>
                              </Dialog>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {panelists.map((item: { name: string, email: string }) => (
                            <TableRow key={item.name}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.email}</TableCell>
                              <TableCell>
                                <Button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removePanelist(item.name);
                                  }}
                                  variant="ghost"
                                >
                                  <Trash2
                                    className='h-4 w-4 text-red-700'

                                  />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </>
                  )}

                  <AdditionalField
                    control={form.control}
                    dataServices={watchMeetingTypeService}
                    defaultValues={data}
                  />

                </>
              )}


              {watchEvent === "hybrid" && (
                <>
                  <FormField
                    control={form.control}
                    name="meeting_type_service"
                    render={() => (
                      <FormItem>
                        {hybridChoice.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="meeting_type_service"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                            ...field.value,
                                            item.id,
                                          ])
                                          : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="camera_setup"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Camera Setup</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="oneCamera" />
                              </FormControl>
                              <FormLabel>1 Camera set-up</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="twoCamera" />
                              </FormControl>
                              <FormLabel>2 Camera set-up</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}



              {watchEvent === "training" && (
                <>
                  <FormField
                    control={form.control}
                    name="meeting_type_service"
                    render={() => (
                      <FormItem>
                        {trainingChoice.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="meeting_type_service"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                            ...field.value,
                                            item.id,
                                          ])
                                          : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}


              {watchEvent === 'events' && (
                <>
                  <FormField
                    control={form.control}
                    name="meeting_type_service"
                    render={() => (
                      <FormItem>
                        {eventsChoice.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="meeting_type_service"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                            ...field.value,
                                            item.id,
                                          ])
                                          : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
          </div>

          <div className='mt-10'>
            <Dialog open={modalSubmitButton} onOpenChange={setModalSubmitButton}>
              <DialogTrigger>
                <Button type="button">Submit</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Edit</DialogTitle>
                </DialogHeader>
                <div className='flex w-full'>
                  <FormField
                    control={form.control}
                    name="editedBy"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                        </div>
                        {assistedBy.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="editedBy"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        const currentValue = field.value || []; // Ensure it's an array
                                        return checked
                                          ? field.onChange([...currentValue, item.id])
                                          : field.onChange(
                                            currentValue.filter((value) => value !== item.id)
                                          )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name="editedBy"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Assisted By</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full h-12">
                              <SelectValue placeholder="Please select who edit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Alyanna">Ma'am Alyanna</SelectItem>
                            <SelectItem value="Laciste">Ma'am Laciste</SelectItem>
                            <SelectItem value='Kyle'>Sir Kyle</SelectItem>
                            <SelectItem value='Emman'>Emman</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  /> */}
                </div>
                <DialogFooter>
                  <Button
                    onClick={form.handleSubmit(onEdit, onError)}
                    className='mt-10'
                    type="submit">Submit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>



        </form>
      </Form>
    </SkeletonWrapper>
  </div>

)
}

export default EditAppointment