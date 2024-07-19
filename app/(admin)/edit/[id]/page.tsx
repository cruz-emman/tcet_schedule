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
import { Input } from '@/components/ui/input';
import { CreateAppointmentSchema, CreateAppointmentSchemaType } from '@/schema/appointment';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { UpdateAppointment } from './_actions/update-appointment';
import { does_have_assistance_choice, hybridChoice, photoVideoChoice, purposeChoice, trainingChoice, zoomMeetingChoice, zoomWebinarChoice } from '@/lib/data';
import SeletGroupFieldInput from '@/components/forms/select-time';
import SelectFieldInput from '@/components/forms/select-field_input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format, isBefore, startOfDay } from 'date-fns';
import { ArrowBigLeft, CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import CheckboxFieldInput from '@/components/forms/check-field-input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';


interface EditPostPageProps {
  params: {
    id: string;
  };
}




const EditAppointment = ({ params }: EditPostPageProps) => {

  const { id } = params;
  const router = useRouter()




  const appoinment = useQuery({
    queryKey: ['appointment', 'data', 'history', id],
    queryFn: () => fetch(`/api/single-sched/${id}`).then((res) => res.json())
  })


  const { data } = appoinment

  const form = useForm<CreateAppointmentSchemaType>({
    resolver: zodResolver(CreateAppointmentSchema),
    defaultValues: {
      does_have_assistance: [],
      meeting_type_service: [],
    }
  });

  useEffect(() => {
    if (data) {
      form.reset({
        title: data.title,
        email: data.email,
        fullname: data.fullname,
        contact_person: data.contact_person,
        department: data.department,
        event_date: new Date(data.event_date),
        purpose: data.purpose,
        venue: data.venue,
        does_have_dry_run: data.does_have_dry_run,
        does_have_assistance: data.does_have_assistance?.split(",") || [],
        name_of_assistance: data.name_of_assistance,
        meeting_type_option: data.meeting_type_option,
        meeting_type_service: data.meeting_type_service?.split(",") || [],
        meeting_type_link: data.meeting_type_link,
        camera_setup: data.camera_setup || "",
        status: data.status
      });
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


  //LOGIC FOR THE DATAS 
  const handleClick = () => {
    form.setValue("dry_run_date", undefined);
    form.setValue("dry_run_start_time", "");
    form.setValue("dry_run_end_time", "");
  };

  const handleMeetingTypeChange = (newMeetingType: any) => {
    form.setValue("meeting_type_option", newMeetingType);
    form.setValue("meeting_type_service", []);
    form.setValue("camera_setup", "")
    form.resetField("meeting_type_link");
    form.resetField("camera_setup");
  };


  let watchEvent = form.watch("meeting_type_option");


  const onEdit = (values: CreateAppointmentSchemaType) => {
    console.log(values)
    mutate({ form: values, id: params.id });
  }

  const onError = (error: any) => {
    console.log(error);
  };


  if (appoinment.isLoading) {
    return <div>
      Loading...
    </div>
  }

  return (
    <>
      <Button asChild className='my-2' size="sm">
        <Link href="/dashboard">
          <ArrowBigLeft />
          Back
        </Link>
      </Button>
      <SkeletonWrapper isLoading={appoinment.isFetching}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onEdit, onError)}
            className='mx-4 flex flex-col gap-y-2'
          >

           <div className='flex flex-col'>
           <p className="text-xl font-semibold">General Information</p>
           
           </div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Event Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full flex flex-col ">
              <div className="flex flex-row gap-x-2">
                <div className="flex flex-1 ">
                  <FormField
                    control={form.control}
                    name="fullname"

                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-1 ">
                  <FormField
                    control={form.control}
                    name="contact_person"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Contact Person</FormLabel>
                        <FormControl>
                          <Input placeholder="Contact Person" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-row gap-x-2">
                <div className="flex flex-1 ">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-1 ">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input placeholder="Department" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>


              <div className="flex flex-col gap-y-2 w-full">
                <p className="text-xl font-semibold">Purpose, Date , and Time</p>

                <div className="flex flex-col md:flex-row  md:items-center md:justify-center gap-x-2">


                  <FormField
                    control={form.control}
                    name="event_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col md:justify-center md:items-center">
                        <FormLabel>Event Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
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
                    className={`w-40`}
                  />

                  <SeletGroupFieldInput
                    name="end_time"
                    defaultValue={data?.end_time}

                    placeholder="end of event.."
                    control={form.control}
                    label="End"
                    className={`w-40`}
                  />

                  <SelectFieldInput
                    control={form.control}
                    defaultValue={data?.purpose}

                    name="purpose"
                    label="Purpose"
                    placeholder="select a purpose"
                    data={purposeChoice}
                    className={`w-full`}
                  />

                  
                </div>
                <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Venue</FormLabel>
                        <FormControl>
                          <Input placeholder="Venue" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              <div className='flex flex-col gap-y-2 w-full'>
                <p className='text-xl font-semibold'>(Optional) Preferred Meeting Date / Dry Run</p>
                <FormField
                  control={form.control}
                  name="does_have_dry_run"
                  defaultValue={data?.does_have_dry_run}
                  render={({ field }) => (
                    <FormItem className="space-y-3">

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
                                defaultValue={form.watch('dry_run_date') || data?.dry_run_date}
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
                                          disabled={(date) =>
                                            new Date(date) <= new Date()
                                          } // Disable past dates and today's date
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
                {form.watch('does_have_assistance').includes('others') && (
                  <FormField
                    control={form.control}
                    name="name_of_assistance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Assistance</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="please type the other assitance"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

              </div>

              <div className='flex flex-col gap-y-2 w-full'>
                <div className='flex gap-2'>


                  <div className="flex flex-col gap-y-2 flex-1 ">
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
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                    <FormField
                      control={form.control}
                      name="meeting_type_link"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Link</FormLabel>
                          <FormControl>
                            <Input placeholder="Link" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={form.handleSubmit(onEdit, onError)}
            >
              {isPending && <Loader2 className="animate-spin" />}
              {!isPending && "Submit"}
            </Button>

          </form>
        </Form>
      </SkeletonWrapper>
    </>
  )
}

export default EditAppointment