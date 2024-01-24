'use client';

import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Label } from '~/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '~/components/ui/popover';
import { Calendar } from '~/components/ui/calendar';

import { Icons } from '~/components/icons';

import { formatDate } from '~/lib/utils';

const createTaskSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  due: z.date().optional()
});

type FormData = z.infer<typeof createTaskSchema>;

export function CreateTaskForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(createTaskSchema)
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='grid gap-5'>
        <div className='grid gap-2'>
          <Label htmlFor='title'>Title</Label>
          <Input id='title' {...register('title')} />
          {errors?.title && (
            <p className='px-1 text-xs text-red-600'>{errors.title.message}</p>
          )}
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='description'>Description</Label>
          <Textarea id='description' {...register('description')} />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='due'>Due</Label>
          <Controller
            control={control}
            name='due'
            render={({ field: { value, onChange } }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id='due'
                    variant='outline'
                    className='flex justify-between'
                  >
                    <span>
                      {value ? formatDate(value.toString()) : 'Pick a date'}
                    </span>
                    <Icons.calender className='size-4' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='center'>
                  <Calendar
                    mode='single'
                    selected={value}
                    onSelect={onChange}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>
        <Button type='submit'>Create 🎉</Button>
      </div>
    </form>
  );
}
