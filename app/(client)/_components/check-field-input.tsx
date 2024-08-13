import React from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import DynamicTableField from "./dynamic-table-field";
import DynamicInputField from "./dynamic-input-field";
import { reminderChoice } from "@/lib/data";
import { Separator } from "@/components/ui/separator";


interface CheckboxOption {
  id: string;
  label: string;
}

interface CheckboxFieldInputProps {
  control: any;
  name: string;
  data: CheckboxOption[];
  openLiveStreaming?: any;
  linkControl?: any;
  linkInputField?: string | "",
  defaultValue?: string[],
  currentPanelist?: any,
  currentReminder?: any
}

const CheckboxFieldInput = ({
  control,
  name,
  data,
  openLiveStreaming,
  linkControl,
  defaultValue,
  currentPanelist,
  currentReminder
}: CheckboxFieldInputProps) => {



  return (

    <>


      <FormField
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={() => (
          <FormItem>
            {data.map((item) => (
              <FormField
                key={item.id}
                control={control}
                name={name}
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








      <ScrollArea className="h-72 ">
      <Separator className="my-4" />
        {(openLiveStreaming.includes('webinar_reminder')) && (
          <div className="px-2 pt-5">
            <FormField
              control={control}
              name={"reminder"}
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


        {(openLiveStreaming.includes('webinar_panelist')) && (
          <div className="px-2 pt-5">
            <DynamicInputField
              control={control}
              name={currentPanelist}
              label="Panelist"
              placeholder={{
                name: "John...",
                email: "john@email.com"
              }}
            />
          </div>
        )}


        {(openLiveStreaming.includes("meeting_livestream") ||
          openLiveStreaming.includes("hybrid_livestreaming") ||
          openLiveStreaming.includes("documentation_livestreaming") ||
          openLiveStreaming.includes("events_livestreaming") ||
          openLiveStreaming.includes("webinar_livestreaming")) && (
            <div className="px-2 pt-5">
              <FormField
                control={linkControl}
                name={"meeting_type_link"}
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

        {(openLiveStreaming.includes("meeting_hybrid") || openLiveStreaming.includes('webinar_hybrid')) && (
          <div className="px-2 pt-5">
            <FormField
              control={control}
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
          </div>
        )}

      </ScrollArea>
    </>

  );
};

export default CheckboxFieldInput;