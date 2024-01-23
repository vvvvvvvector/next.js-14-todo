'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

import { Icons } from '~/components/icons';

const signInSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' })
});

type FormData = z.infer<typeof signInSchema>;

export function SignInForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(signInSchema)
  });

  async function onSubmit(data: FormData) {
    const response = await signIn('credentials', {
      username: data.username,
      password: data.password,
      redirect: false
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='grid gap-10'>
        <div className='grid gap-2'>
          <Label htmlFor='username'>Username</Label>
          <Input
            id='username'
            placeholder='ex@mple1234'
            type='text'
            autoCapitalize='none'
            autoCorrect='off'
            {...register('username')}
          />
          {errors?.username && (
            <p className='px-1 text-xs text-red-600'>
              {errors.username.message}
            </p>
          )}
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            placeholder='strong password'
            type='password'
            autoCapitalize='none'
            autoCorrect='off'
            {...register('password')}
          />
          {errors?.password && (
            <p className='px-1 text-xs text-red-600'>
              {errors.password.message}
            </p>
          )}
        </div>
        <Button disabled={loading}>
          {loading ? (
            <div className='flex items-center gap-2'>
              <Icons.spinner className='size-4 animate-spin' />
              <span>Loading...</span>
            </div>
          ) : (
            'Sign in'
          )}
        </Button>
      </div>
    </form>
  );
}
