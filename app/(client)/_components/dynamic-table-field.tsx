import React, { useEffect, useState } from 'react'
import { Control, useFieldArray } from 'react-hook-form';
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
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash } from 'lucide-react';

interface Props {
    control: Control<any>,
    name: string
    label: string
    placeholder: {
        name: string
        email: string
    }
}



const DynamicTableField = ({
    control,
    name,
    label,
    placeholder
}: Props
) => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    const onClose = () => {
        setIsDialogOpen(false)
    }




    useEffect(() => {
        if (fields.length === 0) {
            append({ name: '', email: '' });
        }
    }, [fields, append]);





    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">
                                <DialogTrigger asChild>
                                    <Button variant="outline">Edit Panelist</Button>
                                </DialogTrigger>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>

                        {fields.map((field:any, index) => (
                            <TableRow key={field.id}>
                                <TableCell>{field.name}</TableCell>
                                <TableCell>{field.email}</TableCell>
                         
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>

                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add panelist</DialogTitle>
                        <DialogDescription>
                            Make changes to your panelist here.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {fields.map((field, index) => {
                            return (
                                <div key={field.id} className="flex flex-row gap-x-2 mb-2">
                                    <FormField
                                        control={control}
                                        name={`${name}.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder={placeholder.name} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name={`${name}.${index}.email`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder={placeholder.email} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        onClick={() => remove(index)}
                                        variant="outline"
                                        size="icon"
                                        type="button"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={() => append({ name: '', email: '' })}
                            type="button"
                        >Add</Button>
                        <Button
                            type='button'
                            onClick={onClose}
                        >Done</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DynamicTableField