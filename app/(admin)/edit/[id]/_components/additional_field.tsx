import React, { useEffect } from 'react'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { reminderChoice } from "@/lib/data";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
interface Props {
    control?: any;
    dataServices: String[]
    defaultValues: any,
 
}

const AdditionalField = ({
    control,
    dataServices,
    defaultValues,
 

}: Props) => {
    

    return (
        <>
            {(dataServices.includes('webinar_reminder')) && (
                <div className="px-2 pt-5">
                    <FormField
                        control={control}
                        name={"reminder"}
                        defaultValue={defaultValues?.reminder}
                        render={() => (
                            <FormItem>
                                <div className="mb-4">
                                    <FormLabel className="text-base">Send Reminder Email to Approved Registrants and Panelist</FormLabel>

                                </div>
                                {reminderChoice.map((item) => (
                                    <FormField
                                        key={item.id}
                                        control={control}
                                        name={"reminder"}
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
                                                                    ? field.onChange([...field.value, item.id])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                            (value: any) => value !== item.id
                                                                        )
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
                </div>
            )}

       

            {(dataServices.includes("meeting_livestream") ||
                dataServices.includes("hybrid_livestreaming") ||
                dataServices.includes("documentation_livestreaming") ||
                dataServices.includes("events_livestreaming") ||
                dataServices.includes("webinar_livestreaming")) && (
                    <div className="px-2 pt-5">
                        <FormField
                            control={control}
                            name={"meeting_type_link"}
                            defaultValue={defaultValues?.meeting_type_link}

                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Link</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="ex. https://www.facebook.com/..."
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )}


            {(dataServices.includes("training_others") ||
                dataServices.includes("meeting_others") ||
                dataServices.includes("webinar_others") ||
                dataServices.includes("hybrid_others") ||
                dataServices.includes("documentation_others") ||
                dataServices.includes("events_others")
            ) && (
                    <div className="px-2 pt-5">
                        <FormField
                            control={control}
                            name={"other_training"}
                            defaultValue={defaultValues?.other_training}

                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Additional/Other Input</FormLabel>
                                    <FormControl>
                                    <Textarea
                                    placeholder="Tell us a little bit about yourself"
                                    className="resize-none"
                                    {...field}
                                    />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )}


            {(dataServices.includes("meeting_hybrid") || dataServices.includes('webinar_hybrid')) && (
                <div className="px-2 pt-5">
                    <FormField
                        control={control}
                        name="camera_setup"
                        defaultValue={defaultValues?.camera_setup}
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
                </div>
            )}


         

        </>
    )
}

export default AdditionalField