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
import { format } from "date-fns";


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








    return (
        <div className="h-[300px] md:h-[600px] w-full">
            <ScrollArea className="h-[300px] md:h-full w-full  border md:p-4 p-2">
                <div className="flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-2">
                        <p className="font-semibold text-gray-600">General Information</p>
                        <div className="flex w-full capitalize  items-center gap-x-2">
                            <div className="flex flex-1">
                                <p className="text-sm font-semibold text-neutral-500/80">title:</p>
                            </div>
                            <div className="flex flex-1">
                                <p className="font-normal">{form.watch('title')}</p>
                            </div>
                        </div>
                        <div className="flex w-full   items-center gap-x-2">
                            <div className="flex flex-1">
                                <p className="text-sm font-semibold text-neutral-500/80">email:</p>
                            </div>
                            <div className="flex flex-1">
                                <p className="font-normal">{form.watch('email')}</p>
                            </div>
                        </div>
                        <div className="flex w-full capitalize  items-center gap-x-2">
                            <div className="flex flex-1">
                                <p className="text-sm font-semibold text-neutral-500/80">full name:</p>
                            </div>
                            <div className="flex flex-1">
                                <p className="font-normal">{form.watch('fullname')}</p>
                            </div>
                        </div>
                        <div className="flex w-full capitalize  items-center gap-x-2">
                            <div className="flex flex-1">
                                <p className="text-sm font-semibold text-neutral-500/80">contact person:</p>
                            </div>
                            <div className="flex flex-1">
                                <p className="font-normal">{form.watch('contact_person')}</p>
                            </div>
                        </div>
                        <div className="flex w-full capitalize  items-center gap-x-2">
                            <div className="flex flex-1">
                                <p className="text-sm font-semibold text-neutral-500/80">department:</p>
                            </div>
                            <div className="flex flex-1">
                                <p className="font-normal">{form.watch('department')}</p>
                            </div>
                        </div>
                    </div>

                    <Separator
                        orientation="horizontal"
                        className="my-2 w-full bg-slate-200"
                    />

                    <div className="flex flex-col gap-y-2">
                        <p className="font-semibold">Purpose, Date & Time</p>
                        <div className="flex w-full capitalize  items-center gap-x-2">
                            <div className="flex flex-1">
                                <p className="text-sm font-semibold text-neutral-500/80">Event Date:</p>
                            </div>
                            <div className="flex flex-1">
                                <p className="font-normal">{formattedDate}</p>
                            </div>
                        </div>
                        <div className="flex w-full capitalize  items-center gap-x-2">
                            <div className="flex flex-1">
                                <p className="text-sm font-semibold text-neutral-500/80">Purpose:</p>
                            </div>
                            <div className="flex flex-1">
                                <p className="font-normal">{form.watch('purpose').split('_').join(" ")}</p>
                            </div>
                        </div>
                        <div className="flex w-full capitalize  items-center gap-x-2">
                            <div className="flex flex-1">
                                <p className="text-sm font-semibold text-neutral-500/80">Start:</p>
                            </div>
                            <div className="flex flex-1">
                                <p className="font-normal">{form.watch('start_time')}</p>
                            </div>
                        </div>
                        <div className="flex w-full capitalize  items-center gap-x-2">
                            <div className="flex flex-1">
                                <p className="text-sm font-semibold text-neutral-500/80">End:</p>
                            </div>
                            <div className="flex flex-1">
                                <p className="font-normal">{form.watch('end_time')}</p>
                            </div>
                        </div>
                    </div>

                    <Separator
                        orientation="horizontal"
                        className="my-2 w-full bg-slate-200"
                    />

                    <div className="flex flex-col gap-y-2">
                        <p className="font-semibold">Additonal Information</p>
                        <div className="flex w-full capitalize  items-center gap-x-2">
                            <div className="flex flex-1">
                                <p className="text-sm font-semibold text-neutral-500/80">Dry Run</p>
                            </div>
                            <div className="flex flex-1">
                                <p className="font-normal">{dryrun}</p>
                            </div>
                        </div>
                        <div className="flex w-full capitalize  items-center gap-x-2">
                            <div className="flex flex-1">
                                <p className="text-sm font-semibold text-neutral-500/80">Start</p>
                            </div>
                            <div className="flex flex-1">
                                <p className="font-normal">{form.watch('dry_run_start_time') ? form.watch('dry_run_start_time') : "None"}</p>
                            </div>
                        </div>
                        <div className="flex w-full capitalize  items-center gap-x-2">
                            <div className="flex flex-1">
                                <p className="text-sm font-semibold text-neutral-500/80">End</p>
                            </div>
                            <div className="flex flex-1">
                                <p className="font-normal">{form.watch('dry_run_end_time') ? form.watch('dry_run_end_time') : "None"}</p>
                            </div>
                        </div>
                        <div className="flex w-full   items-center gap-x-2">
                            <div className="flex flex-1">
                                <p className="text-sm font-semibold text-neutral-500/80">Assistance</p>
                            </div>
                            <div className="flex flex-1">
                                <p className="font-normal">{form.watch('does_have_assistance') ? form.watch('does_have_assistance') : "None"}</p>
                            </div>
                        </div>
                        <div className="flex w-full capitalize  items-center gap-x-2">
                            <div className="flex flex-1">
                                <p className="text-sm font-semibold text-neutral-500/80">Name</p>
                            </div>
                            <div className="flex flex-1">
                                <p className="font-normal">{form.watch('name_of_assistance') ? form.watch('name_of_assistance') : "None"}</p>
                            </div>
                        </div>


                    </div>

                    <Separator
                        orientation="horizontal"
                        className="my-2 w-full bg-slate-200"
                    />

                    <div className="flex flex-col gap-y-2">
                        <p className="font-semibold">Service Features</p>

                        <div className="flex w-full capitalize  items-center gap-x-2">
                            <div className="flex flex-1">
                                <p className="text-sm font-semibold text-neutral-500/80">Meeting Type</p>
                            </div>
                            <div className="flex flex-1">
                                <p className="font-normal">{form.watch('meeting_type_option')}</p>
                            </div>
                        </div>

                        <div className="flex w-full capitalize items-center gap-x-2">
                            <div className="flex flex-1">
                                <p className="text-sm font-semibold text-neutral-500/80">Meeting Service</p>
                            </div>
                            <div className="flex flex-1">
                                <p className="font-normal">{result.join(', ')}</p>
                            </div>
                        </div>

                        <div className="flex w-full  items-center gap-x-2">
                            <div className="flex flex-1">
                                <p className="text-sm font-semibold text-neutral-500/80">Meeting Link</p>
                            </div>
                            <div className="flex flex-1">
                                <p className="font-normal">{form.watch('meeting_type_link') ? form.watch('meeting_type_link') : "None"}</p>
                            </div>
                        </div>

                        <div className="flex w-full  items-center gap-x-2">
                            <div className="flex flex-1">
                                <p className="text-sm font-semibold text-neutral-500/80">Camera</p>
                            </div>
                            <div className="flex flex-1">
                                <p className="font-normal">{form.watch('camera_setup') ? form.watch('camera_setup') : "None"}</p>
                            </div>
                        </div>
                    </div>

                    <Separator
                        orientation="horizontal"
                        className="my-2 w-full bg-slate-200"
                    />
                </div>
            </ScrollArea>
        </div>
    );
};

export default FinalizeForm;