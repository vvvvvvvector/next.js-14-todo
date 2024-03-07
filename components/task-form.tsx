'use client';

import { useState, type Dispatch, type SetStateAction } from 'react';
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
  description: z.string().nullish(),
  due: z.date().nullish()
});

type FormData = z.infer<typeof createTaskSchema>;

function Form({
  props,
  onSubmit,
  children
}: {
  props: any;
  onSubmit: (data: FormData) => Promise<void>;
  children: React.ReactNode;
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>(props);

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
          <Textarea
            className='max-h-80'
            id='description'
            {...register('description')}
          />
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
                    selected={value === null ? undefined : value}
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
        {children}
      </div>
    </form>
  );
}

const createTaskResponseSchema = z.object({
  success: z.boolean(),
  message: z.string()
});

export function CreateTaskForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='flex-shrink-0' variant='outline' size='icon'>
          <Icons.plus className='size-4' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new task</DialogTitle>
        </DialogHeader>
        <Form
          props={{
            resolver: zodResolver(createTaskSchema)
          }}
          onSubmit={async (data) => {
            setLoading(true);

            const response = await fetch('/api/tasks', {
              method: 'POST',
              body: JSON.stringify({
                title: data.title.trim(),
                description: data.description,
                due: data.due
              })
            });

            const json = createTaskResponseSchema.parse(await response.json());

            setLoading(false);

            if (json.success) {
              setOpen(false);

              router.refresh();

              toast.success(json.message);
            } else {
              toast.error(json.message);
            }
          }}
        >
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const editTaskResponseSchema = z.object({
  success: z.boolean(),
  message: z.string()
});

export function EditTaskForm({
  setDialogOpen,
  id,
  title,
  description,
  due
}: {
  id: string;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
} & FormData) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit the task</DialogTitle>
      </DialogHeader>
      <Form
        props={{
          resolver: zodResolver(createTaskSchema),
          defaultValues: {
            title,
            description,
            due
          }
        }}
        onSubmit={async (data) => {
          setLoading(true);

          const response = await fetch(`/api/tasks/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
              title: data.title.trim(),
              description: data.description,
              due: data.due
            })
          });

          const json = editTaskResponseSchema.parse(await response.json());

          setLoading(false);

          if (json.success) {
            router.refresh();

            setDialogOpen(false);

            toast.success(json.message);
          } else {
            toast.error(json.message);
          }
        }}
      >
        <Button disabled={loading} type='submit'>
          {loading ? (
            <div className='flex items-center gap-2'>
              <Icons.spinner className='size-4 animate-spin' />
              <span>Saving...</span>
            </div>
          ) : (
            'Save'
          )}
        </Button>
      </Form>
    </DialogContent>
  );
}
