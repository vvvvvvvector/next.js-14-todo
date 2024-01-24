'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog';

import { Icons } from '~/components/icons';

import { formatDate } from '~/lib/utils';

const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(30, { message: 'The title is too long (max: 30 symbols)' }),
  description: z.string().optional(),
  due: z.date().optional()
});

type FormData = z.infer<typeof createTaskSchema>;

export function CreateTaskForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(createTaskSchema)
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    const response = await fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: data.title.trim(),
        description: data.description,
        due: data.due
      })
    });

    setLoading(false);

    setOpen(false);

    router.refresh();

    toast.success('A new task was successfully created!');

    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='icon'>
          <Icons.plus className='size-4' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-5'>
            <div className='grid gap-2'>
              <Label htmlFor='title'>Title</Label>
              <Input id='title' {...register('title')} />
              {errors?.title && (
                <p className='px-1 text-xs text-red-600'>
                  {errors.title.message}
                </p>
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
                        <Icons.calendar className='size-4' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='center'>
                      <Calendar
                        mode='single'
                        selected={value}
                        onSelect={onChange}
                        disabled={(date) => {
                          const yesterday = (date = new Date()) => {
                            date.setDate(date.getDate() - 1);

                            return date;
                          };

                          return date < yesterday();
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
            <Button disabled={loading} type='submit'>
              {loading ? (
                <div className='flex items-center gap-2'>
                  <Icons.spinner className='size-4 animate-spin' />
                  <span>Loading...</span>
                </div>
              ) : (
                'Create 🎉'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
