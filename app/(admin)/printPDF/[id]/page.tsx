'use client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import CUSTOMLOGO_1 from '@/public/sample_logo.png';
import CUSTOMLOGO2 from '@/public/logo2.png';
import React, { useRef } from 'react'
import Image from 'next/image';
import { format } from 'date-fns';
import { reminderChoice } from '@/lib/data';
import { Checkbox } from '@/components/ui/checkbox';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';

const PrintForm = () => {
  const { id } = useParams()
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef
  });

  const appointment = useQuery({
    queryKey: ['appointment', 'data', 'history', id],
    queryFn: () => fetch(`/api/single-sched/${id}`).then((res) => res.json())
  })



  const { data, isError, isLoading } = appointment

  if (appointment.isLoading) {
    return (
      <div>
        loading...
      </div>
    )
  }




  const returnArray = (data: string) => {
    return data.split(",").map((item) => item.split("_")[1]).join(", ")

  }

  const meeting_services = returnArray(data.meeting_type_service)

  const event_date = data.event_date
  const dryrun_date = data.dry_run_date ? data.dry_run_date : "None"
  const getDryRun = data.does_have_dry_run
  

  let formattedDryRunDate = data.dry_run_date ? format(dryrun_date, "MMMM dd yyyy") : "None"
  let formattedDate = format(event_date, 'MMMM dd yyyy')
  let dryrun = getDryRun ? "Yes" : "No/None"
  let tcetAssistance = data.name_of_assistance
  let seperateAssistance = data.does_have_assistance
  let showReminder = data.reminder
  let showPanelist = data.panelist
  let textAreaReult = data.other_training

  return (
    <div className='flex flex-col gap-2'>
      <Button type="button"
        className=" w-44 m-4"
        variant="outline"
        //@ts-ignore
        onClick={reactToPrintFn}>
        Print Form
      </Button>

      <div ref={contentRef}>
        <div className='p-2 border-2 border-gray-400  m-2'>
          <div className='flex justify-between items-center mb-4'>
            <Image
              src={CUSTOMLOGO_1}
              className='w-20 h-20 object-contain'
              alt='logo'
            />
            <div className='text-center'>
              <p className='text-sm font-bold'>TRINITY UNIVERSITY OF ASIA</p>
              <p className='text-lg'>Trinitian Center for Education and Technology</p>
              <p className='text-sm font-semibold'>tcet@tua.edu.ph</p>
            </div>
            <Image
              src={CUSTOMLOGO2}
              className='w-20 h-20 object-contain'
              alt='logo'
            />
          </div>
          <hr className="my-2 bg-black " />
          <div className='grid grid-cols-2 gap-4 mb-4'>
            <div className='border-r-2 '>
              <h3 className="font-bold mb-2 underline">General Information</h3>
              <p><strong>Title:</strong><span className='capitalize ml-2'>{data.title}</span></p>
              <p><strong>Email:</strong><span className='capitalize ml-2'>{data.email}</span></p>
              <p><strong>Full Name:</strong><span className='capitalize ml-2'>{data.fullname}</span></p>
              <p><strong>Contact Person:</strong><span className='capitalize ml-2'>{data.contact_person}</span></p>
              <p><strong>Department Name:</strong><span className='capitalize ml-2'>{data.department}</span></p>
            </div>
            <div className='border-r-2 '>
              <h3 className="font-bold mb-2 underline">Purpose, Date, & Time</h3>
              <p><strong>Event Date:</strong><span className='capitalize ml-2'>{formattedDate}</span></p>
              <p><strong>Purpose:</strong><span className='capitalize ml-2'>{data.purpose.split('_').join(" ")}</span></p>
              <p><strong>Start:</strong><span className='capitalize ml-2'>{data.start_time}</span></p>
              <p><strong>End:</strong><span className='capitalize ml-2'>{data.end_time}</span></p>
            </div>
          </div>

          <hr className="my-2 bg-black " />
          <div className='grid grid-cols-2 gap-4 mb-4'>
            <div className='border-r-2 '>
              <h3 className="font-bold mb-2 underline">Service Features</h3>
              <p><strong>Meeting Type:</strong><span className='capitalize ml-2'>{data.meeting_type_option}</span></p>
              <p><strong>Meeting Service:</strong><span className='capitalize ml-2'>{meeting_services}</span></p>
              <p><strong>Meeting Link:</strong><span className='capitalize ml-2'>{data.meeting_type_link || "None"}</span></p>
              <p><strong>Camera:</strong><span className='capitalize ml-2'>{data.camera_setup.split("Camera")[0] + ' camera' || "None"}</span></p>
            </div>
            <div className='border-r-2 '>
              <h3 className="font-bold mb-2 underline">Dry Run Information</h3>
              <p><strong>Dry Run:</strong><span className='capitalize ml-2'>{dryrun}</span></p>
              <p><strong>Dry Run Date:</strong><span className='capitalize ml-2'>{formattedDryRunDate}</span></p>
              <p><strong>Start:</strong><span className='capitalize ml-2'>{data.dry_run_start_time || "None"}</span></p>
              <p><strong>End:</strong><span className='capitalize ml-2'>{data.dry_run_end_time || "None"}</span></p>
              <p><strong>Assistance:</strong><span className='capitalize ml-2'>{seperateAssistance ? seperateAssistance : "None"}</span></p>
            </div>
          </div>


          {textAreaReult && (
            <>
              <hr />
              <div className='mb-4'>
              <h3 className='font-bold mb-2 underline'>Additional Information</h3>
              <p
                className='w-full'
              >
                {textAreaReult}
              </p>
              </div>
            </>
          )}


          {showReminder.length > 0 && (
            <>
              <hr />
              <div className='mb-4'>
                <h3 className='font-bold mb-2 underline'>Reminder(s) Email</h3>
                <div className='grid grid-cols-2 gap-2'>
                  {showReminder.split(",").map((item: string, index: number) => {

                    const rem = item.split("_").join(" ")
                    return (
                      <div key={index} className='flex items-center space-x-2'>
                        <Checkbox id={item} checked={true} className='cursor-default' />
                        <label htmlFor={item} className='text-sm capitalize'>{rem}</label>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}


          <hr className="my-2 bg-black " />


          <div className='grid grid-cols-2 gap-4 mb-4'>
            {tcetAssistance.length > 0 && (
              <div>
                <h3 className="font-bold mb-2 underline">Assistance(s) Name</h3>
                {tcetAssistance.map((assistant: { name: string; email: string }, index: number) => (
                  <p key={index}>{assistant.name} - {assistant.email}</p>
                ))}
              </div>
            )}

            {showPanelist.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold mb-2 underline">Panelist(s)</h3>
                {showPanelist.map((panel: { name: string; email: string }, index: number) => (
                  <p key={index}>{panel.name} - {panel.email}</p>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default PrintForm