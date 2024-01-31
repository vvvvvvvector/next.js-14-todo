'use client';

import type { Dispatch, SetStateAction } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  DialogContent,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';

import { Icons } from '~/components/icons';

import { linkRepo } from '~/app/actions';

export const linkRepoSchema = z.object({
  link: z
    .string()
    .min(1, { message: 'There is no link' })
    .regex(new RegExp('https://github.com/.*/.*'), {
      message: `It's not a github repo link 😡`
    })
});

type FormData = z.infer<typeof linkRepoSchema>;

export function LinkRepoForm({
  id,
  setDialogOpen
}: {
  id: string;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { execute, status } = useAction(linkRepo, {
    onSuccess: (data) => {
      if (data && 'failure' in data) {
        toast.error(data.failure);
        return;
      }

      setDialogOpen(false);

      reset();

      toast.success('GitHub repo was successfully linked');
    }
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(linkRepoSchema)
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Attach link to GitHub repo to the task</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={handleSubmit((data) => {
          execute({ link: data.link, taskId: id });
        })}
      >
        <div className='grid gap-5'>
          <div className='grid gap-2'>
            <Label htmlFor='link'>Link</Label>
            <Input
              id='link'
              placeholder='https://github.com/:owner/:repo'
              {...register('link')}
            />
            {errors?.link && (
              <p className='px-1 text-xs text-red-600'>{errors.link.message}</p>
            )}
          </div>
          <Button disabled={status === 'executing'} type='submit'>
            {status === 'executing' ? (
              <div className='flex items-center gap-2'>
                <Icons.spinner className='size-4 animate-spin' />
                <span>Loading...</span>
              </div>
            ) : (
              'Link'
            )}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
