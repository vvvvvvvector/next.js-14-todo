'use client';

import { useState, useTransition } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';

import { Icons } from '~/components/icons';

const signUpResponseSchema = z.object({
  success: z.boolean(),
  message: z.string()
});

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

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(signUpSchema)
  });

  async function onSubmit(data: FormData) {
    setLoading(true);

    const signUpResponse = await fetch('/api/auth/sign-up', {
      method: 'POST',
      body: JSON.stringify({
        username: data.username,
        password: data.password
      })
    });

    const json = await signUpResponse.json(); // probably I can type it using zod

    const result = signUpResponseSchema.parse(json);

    if (!result.success) {
      setLoading(false);

      toast.error(result.message);
    } else {
      toast.promise(
        signIn('credentials', {
          username: data.username,
          password: data.password,
          redirect: false
        }),
        {
          loading: 'Loading...',
          success: () => {
            setLoading(false);

            startTransition(() => {
              router.push(`/${data.username}`);
            });

            return 'Successfully signed up';
          },
          error: () => {
            setLoading(false);

            return 'Error occured while signing in to your account!';
          }
        }
      );
    }
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
        <Button disabled={loading || isPending}>
          {loading || isPending ? (
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
