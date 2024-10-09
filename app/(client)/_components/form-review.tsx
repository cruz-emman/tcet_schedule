import React, { useRef } from "react";
import { useReactToPrint } from 'react-to-print';
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { reminderChoice } from "@/lib/data";
import CUSTOMLOGO_1 from '@/public/sample_logo.png';
import CUSTOMLOGO2 from '@/public/logo2.png';
import { ScrollArea } from "@/components/ui/scroll-area";

interface FinalizeFormProps {
    form: any;
}

const FinalizeForm = ({ form }: FinalizeFormProps) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({
        contentRef
    });

    const event_date = form.watch('event_date');
    const formattedDate = format(event_date, 'MMMM dd yyyy');
    const getServices = form.watch('meeting_type_service');
    const getDryRun = form.watch('does_have_dry_run');

    const returnArray = (data: string[]) => {
        return data.map(item => item.split("_")[1]);
    };

    let result = returnArray(getServices);
    let dryrun = getDryRun ? "Yes" : "No/None";
    let tcetAssistance = form.watch('name_of_assistance');
    let seperateAssistance = form.watch('does_have_assistance');
    let showReminder = form.watch('reminder');
    let showPanelist = form.watch('panelist');

    const isReminderExisting = (showReminder: any) => {
        return showReminder.map((reminder: any) => {
            const choice = reminderChoice.find(choice => choice.id === reminder);
            return choice ? choice.label : undefined;
        }).filter(Boolean);
    };

    const reminderExisting = isReminderExisting(showReminder);

    return (
        <ScrollArea className="h-[600px]  border border-gray-300 p-2">

            <div ref={contentRef}>

                <div className="p-2 border-2 border-gray-400 m-2">
                    <div className="flex justify-between items-center mb-4">
                        <Image src={CUSTOMLOGO_1} className="w-20 h-20 object-contain" alt="logo" />
                        <div className="text-center">
                            <p className="text-sm font-bold">TRINITY UNIVERISTY OF ASIA</p>
                            <p className="text-lg">Trinitian Center for Education and Technology</p>
                            <p className="text-sm font-semibold">tcet@tua.edu.ph</p>
                        </div>
                        <Image src={CUSTOMLOGO2} className="w-20 h-20 object-contain" alt="logo1" />
                    </div>
                    <hr className="my-2 bg-black " />
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="border-r-2 border-gray-400">
                            <h3 className="font-bold mb-2 underline">General Information</h3>
                            <p><strong>Title:</strong> <span className="capitalize">{form.watch('title')}</span> </p>
                            <p><strong>Email:</strong>  {form.watch('email')}</p>
                            <p><strong>Full Name:</strong> <span className="capitalize">{form.watch('fullname')}</span> </p>
                            <p className="capitalize"><strong>Contact Person:</strong> {form.watch('contact_person')}</p>
                            <p className="capitalize"><strong>Department Name:</strong> {form.watch('department')}</p>
                        </div>
                        <div >
                            <h3 className="font-bold mb-2 underline">Purpose, Date & Time</h3>
                            <p className="capitalize"><strong>Event Date:</strong> {formattedDate}</p>
                            <p className="capitalize"><strong>Purpose:</strong> {form.watch('purpose').split('_').join(" ")}</p>
                            <p className="capitalize"><strong>Start:</strong> {form.watch('start_time')}</p>
                            <p className="capitalize"><strong>End:</strong> {form.watch('end_time')}</p>
                        </div>
                    </div>

                    <hr className="my-2 bg-black " />

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="border-r-2 border-gray-400">
                            <h3 className="font-bold mb-2 underline">Service Features</h3>
                            <p className="capitalize"><strong>Meeting Type:</strong> {form.watch('meeting_type_option')}</p>
                            <p className="capitalize"><strong>Meeting Service:</strong> {result.join(', ')}</p>
                            <p className="capitalize"><strong>Meeting Link:</strong> {form.watch('meeting_type_link') || "None"}</p>
                            <p className="capitalize"><strong>Camera:</strong> {form.watch('camera_setup').split('Camera')[0] + ' camera' || "None"}</p>
                        </div>
                        <div>
                            <h3 className="font-bold mb-2 underline">Dry Run Information</h3>
                            <p className="capitalize"><strong>Dry Run:</strong> {dryrun}</p>
                            <p className="capitalize"><strong>Start:</strong> {form.watch('dry_run_start_time') || "None"}</p>
                            <p className="capitalize"><strong>End:</strong> {form.watch('dry_run_end_time') || "None"}</p>
                            <p className="capitalize"><strong>Assistance:</strong> {form.watch('does_have_assistance') ? seperateAssistance.join(', ') : "None"}</p>
                        </div>
                    </div>

                    {reminderExisting.length > 0 && (
                        <>
                            <hr className="my-2 bg-black " />
                            <div className="mb-4">
                                <h3 className="font-bold mb-2 underline">Reminder(s) Email</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {reminderExisting.map((item: string, index: number) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <Checkbox id={item} checked={true} />
                                            <label htmlFor={item} className="text-sm">{item}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    <hr className="my-2 bg-black " />

                    <div className="grid grid-cols-2 gap-4 mb-4">

                        {tcetAssistance.length > 0 && (
                            <>
                                <div>
                                    <h3 className="font-bold mb-2 underline">Assistance(s) Name</h3>
                                    {tcetAssistance.map((assistant: { name: string; email: string }, index: number) => (
                                        <p key={index}>{assistant.name} - {assistant.email}</p>
                                    ))}
                                </div>
                            </>
                        )}

                        {showPanelist.length > 0 && (
                            <>
                                <div className="mb-4">
                                    <h3 className="font-bold mb-2 underline">Panelist(s)</h3>
                                    {showPanelist.map((panel: { name: string; email: string }, index: number) => (
                                        <p key={index}>{panel.name} - {panel.email}</p>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* {tcetAssistance.length > 0 && (
                        <>
                            <div>
                                <h3 className="font-bold mb-2 underline">Assistance(s) Name</h3>
                                {tcetAssistance.map((assistant: { name: string; email: string }, index: number) => (
                                    <p key={index}>{assistant.name} - {assistant.email}</p>
                                ))}
                            </div>
                        </>
                    )}

                    {showPanelist.length > 0 && (
                        <>
                            <hr className="my-2 bg-black " />
                            <div className="mb-4">
                                <h3 className="font-bold mb-2 underline">Panelist(s)</h3>
                                {showPanelist.map((panel: { name: string; email: string }, index: number) => (
                                    <p key={index}>{panel.name} - {panel.email}</p>
                                ))}
                            </div>
                        </>
                    )} */}
                </div>

            </div>

            <Button type="button"
                className="mb-5"
                //@ts-ignore
                onClick={reactToPrintFn}>
                Print Form
            </Button>
        </ScrollArea>
    );
};

export default FinalizeForm;
