import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Trash } from 'lucide-react';
import React, { useEffect } from 'react';
import { Control, useFieldArray } from 'react-hook-form';

interface Props {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: {
    name: string;
    email: string;
  };
}

const DynamicInputField: React.FC<Props> = ({
  control,
  name,
  label,
  placeholder,
}) => {
  const { fields, append, remove } = useFieldArray({
control,
    name,
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({ name: '', email: '' });
    }
  }, [fields, append]);



  return (
    <div className='flex flex-col gap-y-2'>
      <div className='mb-4'>
      <FormLabel className="text-base">{label}</FormLabel>

      </div>
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
      <Button 
        className='w-20'
        onClick={() => append({ name: '', email: '' })} 
        size="sm"
        type="button"
      >
        Add
      </Button>
    </div>
  );
};

export default DynamicInputField;
