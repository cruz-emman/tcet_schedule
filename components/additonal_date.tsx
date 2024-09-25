import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon, PlusIcon, Trash, TrashIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { Control, useFieldArray } from 'react-hook-form'
import { timeAM, timePM } from '@/lib/data'
import { useCurrentUser } from '@/hooks/user-current-user'


interface Props {
  control: Control<any>
  name: string;
  pickedDate: Date | undefined
  label: string;


}

const AdditionalDate = ({ control, name, pickedDate, label }: Props) => {

  const admin = useCurrentUser()

  const { fields, append, remove } = useFieldArray({
    control,
    name
  })


  useEffect(() => {
    if (fields.length === 0) {
      append({ additonal_date_data: undefined, additonal_date_start: '', additonal_date_end: '' });
    }
  }, [fields, append]);


  return (
    <div className='flex flex-col gap-y-4 p-4'>
      <FormLabel>{label}</FormLabel>
      {fields.map((field, index) => (
        <div className='flex items-center  gap-x-2 mb-2' key={field.id}>
          <FormField
            control={control}
            name={`${name}.${index}.additonal_date_data`}
            render={({ field }) => (
              <FormItem className="flex flex-col">
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
                      // disabled={[
                      //   { before: new Date() },
                      // ]}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`${name}.${index}.additonal_date_start`}
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Start Time" />
                    </SelectTrigger>
                  </FormControl>
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

              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${name}.${index}.additonal_date_end`}
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="End Time" />
                    </SelectTrigger>
                  </FormControl>
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

              </FormItem>
            )}
          />

            {admin && (
              <>
              {/* <FormField
                control={control}
                name={`${name}.${index}.additional_status`}
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[300px]">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>o
                      <SelectContent>
                        <SelectContent>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="cancel">Cancel</SelectItem>
                        </SelectContent>
                      </SelectContent>
                    </Select>

                  </FormItem>
                )}
              /> */}
              </>
            )}
            
    



          <Button
            onClick={() => remove(index)}
            variant="outline"
            size="icon"
            type="button"
            className='align-self
                '
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>

      ))}

      <Button
        className='w-20'
        onClick={() => append({ name: '', email: '' })}
        size="sm"
        type="button"
      >
        Add
      </Button>
    </div>

  )
}

export default AdditionalDate


