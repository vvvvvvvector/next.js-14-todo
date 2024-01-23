'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';

import { Icons } from '~/components/icons';

const signUpSchema = z
  .object({
    username: z.string().min(1, { message: 'Username is required' }),
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .regex(new RegExp('^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{8,}$'), {
        message: 'Minimum 8 characters, at least 1 letter and 1 number'
      }),
    confirmPassword: z.string().min(1, { message: 'Confirm is required' })
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: 'custom',
        message: 'The passwords did not match'
      });
    }
  });

type FormData = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(signUpSchema)
  });

  async function onSubmit(data: FormData) {
    console.log(data);

    const res = await fetch('/api/auth/sign-up', {
      method: 'POST',
      body: JSON.stringify({
        username: data.username,
        password: data.password
      })
    });

    // then if everything is fine signIn()....

    const message = await res.json();

    console.log(message);
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
            {...register('password')}
          />
          {errors?.password && (
            <p className='px-1 text-xs text-red-600'>
              {errors.password.message}
            </p>
          )}
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='confirm-password'>Confirm password</Label>
          <Input
            id='confirm-password'
            placeholder='repeat strong password'
            type='password'
            autoCapitalize='none'
            autoCorrect='off'
            {...register('confirmPassword')}
          />
          {errors?.confirmPassword && (
            <p className='px-1 text-xs text-red-600'>
              {errors.confirmPassword.message}
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
            'Sign up'
          )}
        </Button>
      </div>
    </form>
  );
}
