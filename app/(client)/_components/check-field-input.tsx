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
  defaultValue?: string[]
}

const CheckboxFieldInput = ({
  control,
  name,
  data,
  openLiveStreaming,
  linkControl,
  defaultValue
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

      {(openLiveStreaming[0].includes("meeting_livestream") ||
        openLiveStreaming[0].includes("hybrid_livestreaming") ||
        openLiveStreaming[0].includes("webinar_livestreaming")) && (
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
        )}

      {(openLiveStreaming[0].includes("meeting_hybrid") || openLiveStreaming[0].includes('webinar_hybrid')) && (
        <>
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
        </>
      )}

    </>
  );
};

export default CheckboxFieldInput;