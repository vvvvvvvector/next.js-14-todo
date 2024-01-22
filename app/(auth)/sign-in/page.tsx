import { type Metadata } from 'next';
import Link from 'next/link';

import { SignInForm } from '~/components/sign-in-form';

import { PAGES } from '~/lib/constants';

export const metadata: Metadata = {
  title: 'Auth / Sign in',
  description: 'Sign in to your account'
};

export default function SignInPage() {
  return (
    <div className='grid h-screen place-items-center'>
      <div className='flex w-full max-w-[400px] flex-col gap-12 px-4 sm:px-0'>
        <div className='space-y-3 text-center'>
          <h1 className='text-2xl font-semibold tracking-wider'>
            Welcome back 👋
          </h1>
          <p className='text-sm'>
            Enter your credentials to sign in to your account
          </p>
        </div>
        <SignInForm />
        <div className='flex justify-center gap-3 text-sm'>
          <span>Don&apos;t have an account?</span>
          <Link href={PAGES.SIGN_UP} className='text-neutral-500 underline'>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
