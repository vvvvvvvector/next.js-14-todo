'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  DialogContent,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';

const linkRepoSchema = z.object({
  link: z
    .string()
    .min(1, { message: 'There is no link' })
    .regex(new RegExp('https://github.com/.*/.*'), {
      message: `It's not a github repo link 😡`
    })
});

type FormData = z.infer<typeof linkRepoSchema>;

export function LinkRepoForm() {
  const {
    register,
    handleSubmit,
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
          console.log(data);
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
          <Button type='submit'>Link</Button>
        </div>
      </form>
    </DialogContent>
  );
}
