import React from "react";

import {
    hybridChoice,
    photoVideoChoice,
    purposeChoice,
    zoomMeetingChoice,
    zoomWebinarChoice,
} from "@/lib/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { DateToUTCDate } from "@/lib/helpers";
import { reminderChoice } from "@/lib/data";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox";
import { format, compareAsc, parse, getDate, getYear, getMonth } from "date-fns";


interface FinalizeFormProps {
    form: any;
}

const FinalizeForm = ({ form }: FinalizeFormProps) => {

    const event_date = form.watch('event_date')
    const formattedDate = format(event_date, 'MMMM dd yyyy');
    const getServices = form.watch('meeting_type_service')
    const getDryRun = form.watch('does_have_dry_run')

    const returnArray = (data: string[]) => {
        const result = []; // Initialize an empty array to collect the results
        for (let i = 0; i < data.length; i++) {
            result.push(data[i].split("_")[1]); // Split each string and push the second part to the result array
        }
        return result; // Return the result array after the loop completes
    }

    let result = returnArray(getServices)


    const checkDryRun = (getDryRun: boolean): string => {
        return getDryRun === true ? "Yes" : "No/None";
    };

    let dryrun = checkDryRun(getDryRun)
    let tcetAssitance = form.watch('name_of_assistance')
    let seperateAssistance = form.watch('does_have_assistance')


    let showReminder = form.watch('reminder')
    let showPanelist = form.watch('panelist')

    console.log(form.watch())

    const isReminderExisting = (showReminder: any) => {
        return showReminder.map((reminder: any) => {
            const choice = reminderChoice.find(choice => choice.id === reminder);
            return choice ? choice.label : undefined;
        }).filter((label: string) => label !== undefined); // Filter out any undefined values
    }

    const reminderExisting = isReminderExisting(showReminder)


    return (
        <ScrollArea className="h-[300px] md:h-[600px] w-full">
            <div className="h-[300px] md:h-full w-full  border md:p-4 p-2">
                <div className="flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-2">
                        <p className="font-semibold text-gray-600">General Information</p>
                        <Table>
                            <TableHeader>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="w-[250px]">Title:</TableCell>
                                    <TableCell>{form.watch('title')}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-[250px]">Email:</TableCell>
                                    <TableCell>{form.watch('email')}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-[250px]">Full Name:</TableCell>
                                    <TableCell>{form.watch('fullname')}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-[250px]">Contact Person:</TableCell>
                                    <TableCell>{form.watch('contact_person')}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-[250px]">Department Name:</TableCell>
                                    <TableCell>{form.watch('department')}</TableCell>
                                </TableRow>
                            </TableBody>

                        </Table>

                    </div>

                    <Separator
                        orientation="horizontal"
                        className="my-2 w-full "
                    />

                    <div className="flex flex-col gap-y-2">
                        <p className="font-semibold">Purpose, Date & Time</p>
                        <Table>
                            <TableHeader>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="w-[250px]">Event Date:</TableCell>
                                    <TableCell>{formattedDate}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-[250px]">Purpose:</TableCell>
                                    <TableCell>{form.watch('purpose').split('_').join(" ")}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-[250px]">Start:</TableCell>
                                    <TableCell>{form.watch('start_time')}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-[250px]">End:</TableCell>
                                    <TableCell>{form.watch('end_time')}</TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                    </div>

                    {form.watch('additional_date_information').length > 0 && (
                        <>
                            <Separator
                                orientation="horizontal"
                                className="my-2 w-full "
                            />

                            <div className="flex flex-col gap-y-2">
                                <p className="font-semibold">Recurring Dates</p>
                                <Table>
                                    <TableHeader></TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="w-[250px]">Additional Date:</TableCell>
                                            <TableCell

                                            >{form.watch('additional_date_information').map(({ additonal_date_data, additonal_date_end, additonal_date_start, index }: {
                                                additonal_date_data: any
                                                additonal_date_start: string
                                                additonal_date_end: string
                                                index: number

                                            }) => {
                                                let date = additonal_date_data.toString().split(' ')

                                                return (
                                                    <TableRow
                                                        key={index}

                                                    >
                                                        <div> {date[1]} {date[2]}, {date[3]}  {additonal_date_start} - {additonal_date_end}</div>
                                                    </TableRow>
                                                )
                                            })}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )}





                    <Separator
                        orientation="horizontal"
                        className="my-2 w-full "
                    />

                    <div className="flex flex-col gap-y-2">
                        <p className="font-semibold">Dry Run Information</p>
                        <Table>
                            <TableHeader>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="w-[250px]">Dry Run</TableCell>
                                    <TableCell>{dryrun}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-[250px]">Start</TableCell>
                                    <TableCell>{form.watch('dry_run_start_time') ? form.watch('dry_run_start_time') : "None"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-[250px]">End</TableCell>
                                    <TableCell>{form.watch('dry_run_end_time') ? form.watch('dry_run_end_time') : "None"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-[250px]">Assistance</TableCell>
                                    <TableCell>{form.watch('does_have_assistance') ? seperateAssistance.join(', ') : "None"}
                                    </TableCell>
                                </TableRow>
                                {tcetAssitance.length !== 0 && (
                                    <TableRow>
                                        <TableCell className="flex w-[250px]">Assistance(s) Name</TableCell>

                                        <TableCell>
                                            <TableRow>
                                                <div className="flex font-semibold text-xs flex-row overflow-x-auto gap-x-4 ">
                                                    <p className="w-[200px]">Name</p>
                                                    <p className="w-[200px]">Email</p>

                                                </div>
                                                <div className="flex capitalize flex-col">
                                                    {tcetAssitance.map((panel: { name: string; email: string }) => (
                                                        <div key={panel.name} className="flex flex-row overflow-x-auto w-full items-center justify-center gap-x-4 ">
                                                            <p className="w-[200px]">{panel.name}</p>
                                                            <p className="w-[200px]">{panel.email}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </TableRow>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                    </div>

                    <Separator
                        orientation="horizontal"
                        className="my-2 w-full "
                    />

                    <div className="flex flex-col gap-y-2">
                        <p className="font-semibold">Service Features</p>

                        <Table>
                            <TableHeader>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="w-[250px]">Meeting Type</TableCell>
                                    <TableCell className="capitalize">{form.watch('meeting_type_option')}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="flex  w-[250px]">Meeting Service</TableCell>
                                    <TableCell>
                                        <div className="flex capitalize flex-col">
                                            {result.map((r) => (
                                                <div key={r}>
                                                    {r}
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-[250px]">Meeting Link</TableCell>
                                    <TableCell>{form.watch('meeting_type_link') ? form.watch('meeting_type_link') : "None"}</TableCell>
                                </TableRow>
                                {showPanelist.length !== 0 && (
                                    <TableRow>
                                        <TableCell className="w-[250px] flex">Panelist(s)</TableCell>
                                        <TableCell>
                                            <div className="flex font-semibold text-xs flex-row overflow-x-auto  ">
                                                <p className="w-[200px]">Name</p>
                                                <p className="w-[200px]">Email</p>

                                            </div>
                                            <div className="flex capitalize flex-col">
                                                {showPanelist.map((panel: { name: string; email: string }) => (
                                                    <div key={panel.name} className="flex flex-row overflow-x-auto w-full  ">
                                                        <p className="w-[200px]">{panel.name}</p>
                                                        <p className="w-[200px]">{panel.email}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {showReminder.length !== 0 && (
                                    <TableRow>
                                        <TableCell className="w-[250px] flex">Reminder(s) Email</TableCell>
                                        <TableCell>
                                            <div className="flex capitalize flex-col">
                                                {reminderExisting.map((item: any) => (
                                                    <div key={item} className="flex flex-row overflow-x-auto gap-x-4 ">
                                                        <div className="flex items-center space-y-2 space-x-2">
                                                            <Checkbox id={item} checked={true} className="mr-2" />
                                                            {item}

                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}

                                <TableRow>
                                    <TableCell className="w-[250px]">Camera</TableCell>
                                    <TableCell>{form.watch('camera_setup') ? form.watch('camera_setup') : "None"}</TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
};

export default FinalizeForm;