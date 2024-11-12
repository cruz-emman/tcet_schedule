"use client";


import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { DialogTitle } from '@radix-ui/react-dialog';
import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { CreateAppointmentSchema, CreateAppointmentSchemaType } from '@/schema/appointment';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import SelectFieldInput from './select-field_input';
import { departmentOptions, does_have_assistance_choice, eventsChoice, hybridChoice, photoVideoChoice, purposeChoice, trainingChoice, zoomMeetingChoice, zoomWebinarChoice } from '@/lib/data';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import CheckboxFieldInput from './check-field-input';
import TableDataSample from './table-data';
import FinalizeForm from './form-review';
import SeletGroupFieldInput from './select-time';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateAppointment } from '../_actions/appoint-schedule';
import { toast } from 'sonner';
import { useCurrentUser } from '@/hooks/user-current-user';
import DynamicInputField from './dynamic-input-field';
import AdditionalDate from '../../../components/additonal_date';
import TCETLOGO from '@/public/sample_logo.png'
import tcet_logo_2 from '@/public/logo2.png'
import DownloadButton from "./download-pdfbutton";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';


interface Props {
  trigger?: ReactNode;
  open?: boolean;
  setOpen?: any;
  pickedDate: Date | undefined;
}


interface Users {
  name?: string
  email?: string
}





const steps = [
  {
    id: 'Step 1',
    name: 'General Information',
    fields: ['title', 'email', 'fullname', 'contact_person', 'department']
  },
  {
    id: 'Step 2',
    name: 'Date, Time and Purpose',
    fields: ['event_date', 'additional_date_information', 'start_time', 'end_time', 'purpose', 'additonal_date']
  },
  {
    id: "Step 3",
    name: "Dry Run",
    fields: ['does_have_dry_run', 'dry_run_date', 'dry_run_start_time', 'dry_run_end_time', 'does_have_assistance', 'name_of_assistance']
  },
  {
    id: "Step 4",
    name: "Type of Service",
    fields: ['meeting_type_option', 'meeting_type_service', 'panelist', 'reminder', 'meeting_type_link', 'camera_setup', 'other_training']
  },
  {
    id: "Steps 5",
    name: "Finalization",

  }
]


const CreateScheduleDialog = ({ open, setOpen, pickedDate }: Props) => {

  const [dialogOpen, setDialogOpen] = useState(false);
  const [meetingType, setMeetingType] = useState("meeting"); // Optional
  const [confirmAgreement, setConfirmAgreement] = useState(false);


  const navigate = useRouter()
  const [step, setStep] = useState(0);
  const currentStep = steps[step];



  const form = useForm<CreateAppointmentSchemaType>({
    resolver: zodResolver(CreateAppointmentSchema),
    defaultValues: {
      title: '',
      email: '',
      fullname: '',
      contact_person: '',
      department: '',
      //Step 2
      purpose: '',
      event_date: pickedDate, // Use the pickedDate prop here
      //additonal information
      additonal_date: false,
      additional_date_information: [],
      start_time: '',
      end_time: '',
      venue: '',
      // //Step 3
      does_have_dry_run: false,
      dry_run_date: undefined,
      dry_run_start_time: '',
      dry_run_end_time: '',
      does_have_assistance: ["none"],
      name_of_assistance: [],
      // //Step 4
      meeting_type_option: 'meeting',
      meeting_type_service: [],
      panelist: [],
      reminder: [],
      meeting_type_link: '',
      other_training: '',
      camera_setup: '',
      status: 'pending'
    }
  })

  type FieldName = keyof CreateAppointmentSchemaType;


  const nextStep = async () => {
    const fields = steps[step].fields as FieldName[];
    //console.log("Fields to validate:", fields);

    const isValid = await form.trigger(fields, { shouldFocus: true });
    // console.log("Validation result:", isValid, form.formState.errors);


    if (!isValid) return;

    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }

    if (step !== steps.length) {
      setConfirmAgreement(false);
    }
  };


  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: CreateAppointment,
    onSuccess: async () => {
      toast.success('Your schedule has been submitted upon approval. Kindly wait 1-2 days for your request to be approved working! 🎉', {
        id: "create-appointment"
      });
  
      form.reset();
      setConfirmAgreement(false);
      setStep(0);
      setDialogOpen(false);
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["appointment"] });
  
      setTimeout(() => {
        window.open('https://docs.google.com/forms/d/e/1FAIpQLSeF2jcpqfKJVz7ABgz1wS8XGlzmULO2mMJCSuUVCU3aScB5Vg/viewform', '_blank');
      }, 1000);
    },
    onError: async () => {
      toast.error('Sorry, you might have inputted incorrect information. Please check the email and try again.', {
        id: "create-appointment-error"
      });
  
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  });
  

  const onSubmit = useCallback((values: CreateAppointmentSchemaType) => {
    toast.loading("Creating Appointment...", { id: 'create-appointment' });

    mutate(values)



  }, [mutate])

  //BUTTONS FOR RESESTING FORM FIELDS

  let hasOtherAssistance = form.watch("does_have_assistance");

  let watchChoices = form.watch("meeting_type_service");


  const handleClick = () => {
    form.resetField("dry_run_date");
    form.resetField("dry_run_start_time");
    form.resetField("dry_run_end_time");
  };

  const handleMeetingTypeChange = (newMeetingType: any) => {
    form.setValue("meeting_type_option", newMeetingType);
    form.setValue("meeting_type_service", []);
    form.resetField("meeting_type_link");
    form.resetField("camera_setup");
    setMeetingType(newMeetingType);
  };

  const confirmAgreementFuntion = () => {
    setConfirmAgreement((prev) => !prev);
  };



  useEffect(() => {
    if(dialogOpen === true){
      setConfirmAgreement(false)
    }
  }, [dialogOpen])


  useEffect(() => {
    if (pickedDate) {
      form.setValue('event_date', pickedDate);
    }

    if (!hasOtherAssistance.includes('others')) {
      form.resetField('name_of_assistance')
    }

    if (!watchChoices.includes('webinar_panelist')) {
      form.resetField('panelist')
    }
    if (!watchChoices.includes('webinar_reminder')) {
      form.resetField('reminder')
    }

    if (form.watch('additonal_date') == false) {
      form.resetField('additional_date_information')
    }

  }, [pickedDate, form, hasOtherAssistance, watchChoices, form.watch('additonal_date')]);



  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={!open}
          className='w-[120px] mt-10 text-right'
          color="primary-foreground"
          onClick={() => setDialogOpen(true)}

        >Add Schedule</Button>
      </DialogTrigger>
      <DialogContent className={
        cn(
          'max-w-[90vw] h-auto',  // Default size for small screens
          'md:max-w-3xl lg:max-w-4xl ',  // Larger sizes for medium and large screens
          step === 3 && 'max-w-full lg:h-auto',

        )}>
        <DialogHeader>
          <DialogTitle>{currentStep.name}</DialogTitle>
          <DialogDescription>
            Step {step + 1} of {steps.length}
          </DialogDescription>
        </DialogHeader>
        <Form {...form} >
          <form className='' onSubmit={form.handleSubmit(onSubmit)} >

            {step == 0 && (
              <ScrollArea className='h-[400px]'>
                <div className='flex flex-col gap-y-2 px-4'>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (required)</FormLabel>
                      <FormControl>
                        <Input type='text' placeholder="Title" {...field} />
                      </FormControl>

                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (required)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>

                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requested By: (required)</FormLabel>
                      <FormControl>
                        <Input placeholder="Scheduled By" {...field} />
                      </FormControl>

                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact_person"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person (required)</FormLabel>
                      <FormControl>
                        <Input placeholder="Contact Person" {...field} />
                      </FormControl>

                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>College / Unit (required)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a college / unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel className='font-bold text-xl pb-5'>Departments</SelectLabel>
                            {departmentOptions.map((item) => {
                              let acro = item.label.split('-')[0]
                              let fullName = item.label.split('-')[1]
                            return (
                              <SelectItem key={item.value} value={item.value}>
                                <span className='font-semibold'>{acro}</span> - 
                                {fullName}
                                </SelectItem>
                            )
                          })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>


                    </FormItem>
                  )}
                />
              </div>
              </ScrollArea>
            )}
            {step == 1 && (
             <ScrollArea className='h-[400px]'>
               <div className='flex flex-col gap-y-2 p-4'>
                  <div className='flex flex-col  gap-2 w-full'>

                    <SeletGroupFieldInput
                      name="start_time"
                      placeholder="Select time"
                      control={form.control}
                      label="Start"
                    />
                    <SeletGroupFieldInput
                      name="end_time"
                      placeholder="Select time"
                      control={form.control}
                      label="End"
                    />

                  </div>

                  <FormField
                    control={form.control}
                    name="event_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of event</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button

                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
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
                        </Popover>
                      </FormItem>
                    )}
                  />

                  {/* Recurring DATE */}
                  <FormField
                    control={form.control}
                    name="additonal_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md  ">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>
                          Recurring Date
                        </FormLabel>
                      </FormItem>
                    )}
                  />


                  {form.watch('additonal_date') === true && (
                    <>
                      <AdditionalDate
                        control={form.control}
                        name="additional_date_information"
                        pickedDate={pickedDate}
                        label="Required if click the checkbox, unclick if not"
                      />
                    </>
                  )}

                  <SelectFieldInput
                    control={form.control}
                    name="purpose"
                    label="Purpose"
                    placeholder="select a purpose"
                    data={purposeChoice}
                  />
                  <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue (optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Venue"
                            {...field}
                            value={field.value ?? ""} />
                        </FormControl>

                      </FormItem>
                    )}
                  />


              </div>
             </ScrollArea>
            )}
            {step == 2 && (
              <ScrollArea className='h-[300px]'>
<div className='flex flex-col gap-y-2 p-4'>
                <FormField
                  control={form.control}
                  name="does_have_dry_run"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        (Optional) Preferred Meeting Date / Dry Run
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) =>
                            field.onChange(value === "true")
                          }
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
                            <div className="flex flex-col gap-2">
                              <FormField
                                control={form.control}
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
                                          // disabled={(date) =>
                                          //   new Date(date) <= new Date()
                                          // } 
                                          // Disable past dates and today's date
                                          disabled={[
                                            { before: new Date() },
                                            { after: pickedDate! }
                                          ]}
                                          selected={field.value}
                                          onSelect={field.onChange}
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>

                                  </FormItem>
                                )}
                              />
                              <SeletGroupFieldInput
                                name="dry_run_start_time"
                                placeholder="Select time"
                                control={form.control}
                                label="Start"
                              />
                              <SeletGroupFieldInput
                                name="dry_run_end_time"
                                placeholder="Select time"
                                control={form.control}
                                label="End"
                              />


                            </div>
                          </div>
                        </FormItem>
                      )}


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
                          Tech Assitance
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
                                      const currentValue = field.value || [];
                                      let newValue;

                                      if (item.id === 'none' && checked) {
                                        // If "None" is checked, uncheck all others
                                        newValue = ['none'];
                                      } else if (checked) {
                                        // If any other option is checked, remove "None" and add the new option
                                        newValue = currentValue.filter(v => v !== 'none');
                                        newValue.push(item.id);
                                      } else {
                                        // If unchecking, simply remove the item
                                        newValue = currentValue.filter(v => v !== item.id);
                                      }

                                      field.onChange(newValue);
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

                    </FormItem>
                  )}
                />

                {hasOtherAssistance.includes("others") && (
                  <DynamicInputField
                    control={form.control}
                    name="name_of_assistance"
                    label="Other Assistance"
                    placeholder={{
                      name: "John...",
                      email: "john@email.com"
                    }}
                  />

                )}
              </div>
              </ScrollArea>
            )}
            {step == 3 && (
              <ScrollArea className='h-[400px]'>
              <div className='flex gap-2 '>
                <div className="flex flex-col w-full md:flex-row gap-x-4">
                  <div className=" flex-1 hidden md:flex">
                    <TableDataSample />
                  </div>

                  <div className="flex flex-col gap-y-2 flex-1 ">
                    <FormField
                      control={form.control}
                      name="meeting_type_option"
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


                        </FormItem>
                      )}
                    />

                    {meetingType === "meeting" && (
                      <>
                        <CheckboxFieldInput
                          control={form.control}
                          name="meeting_type_service"
                          data={zoomMeetingChoice}
                          linkControl={form.control}
                          openLiveStreaming={watchChoices}
                          linkInputField="meeting_type_link"
                        />
                      </>
                    )}

                    {meetingType === "webinar" && (
                      <>
                        <CheckboxFieldInput
                          control={form.control}
                          name="meeting_type_service"
                          data={zoomWebinarChoice}
                          linkControl={form.control}
                          openLiveStreaming={watchChoices}
                          linkInputField="meeting_type_link"
                          currentPanelist="panelist"
                          currentReminder='reminder'
                        />



                      </>
                    )}

                    {meetingType === "hybrid" && (
                      <div className='flex flex-col gap-y-5'>
                        <FormLabel></FormLabel>
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

                            </FormItem>
                          )}
                        />
                        <p>Additional Services (for approval)</p>
                        <CheckboxFieldInput
                          control={form.control}
                          name="meeting_type_service"
                          data={hybridChoice}
                          linkControl={form.control}
                          openLiveStreaming={watchChoices}
                          linkInputField="meeting_type_link"
                        />


                      </div>
                    )}

                    {meetingType === "documentation" && (
                      <>
                        <CheckboxFieldInput
                          control={form.control}
                          name="meeting_type_service"
                          data={photoVideoChoice}
                          linkControl={form.control}
                          openLiveStreaming={watchChoices}
                          linkInputField="meeting_type_link"
                        />
                      </>
                    )}
                    {meetingType === "training" && (
                      <>
                        <CheckboxFieldInput
                          control={form.control}
                          name="meeting_type_service"
                          data={trainingChoice}
                          linkControl={form.control}
                          openLiveStreaming={watchChoices}
                          linkInputField="meeting_type_link"
                          trainingName="other_training"

                        />
                      </>
                    )}

                    {meetingType === "events" && (
                      <>

                        <CheckboxFieldInput
                          control={form.control}
                          name="meeting_type_service"
                          data={eventsChoice}
                          linkControl={form.control}
                          openLiveStreaming={watchChoices}
                          linkInputField="meeting_type_link"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
              </ScrollArea>
            )}
            {step == 4 && (
              <ScrollArea className='h-[420px]'>
                  <div className='flex flex-col gap-2'>
                <FinalizeForm form={form} />

                <div className="items-top flex space-x-2">

                  <Checkbox id="terms1" onClick={confirmAgreementFuntion} />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms1"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I understand
                    </label>
                    <p className="text-sm text-muted-foreground">
                      If you have{" "}
                      <span className="font-bold text-red-500">
                        Zoom Background, Banner, Poster or Program Flow
                      </span>{" "}
                      please email{" "}
                      <span className="font-bold text-blue-600 underline">
                        tcet@tua.edu.ph
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              </ScrollArea>
            )}
          </form>

        </Form>
        <DialogFooter className='flex flex-col md:flex-row gap-2'>
          <Button onClick={prevStep} disabled={step === 0}>Back</Button>
          {step === steps.length - 1 ? (
            <DialogClose asChild>


              <Button
                disabled={confirmAgreement === false}
                onClick={form.handleSubmit(onSubmit)}
              >
                {isPending && <div className='flex items-center gap-x-2'>
                  Submitting...
                  <Loader2 className="animate-spin" />
                </div>}
                {!isPending && "Submit"}
              </Button>

            </DialogClose>

          ) : (
            <Button
              onClick={nextStep}
            >
              Next
            </Button>
          )}
        </DialogFooter>
      </DialogContent>

    </Dialog>
  )
}

export default CreateScheduleDialog