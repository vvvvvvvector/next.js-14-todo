import { type Metadata } from 'next';
import Link from 'next/link';

import { SignUpForm } from '~/components/sign-up-form';

import { PAGES } from '~/lib/constants';

export const metadata: Metadata = {
  title: 'Auth / Sign up',
  description: 'Create a new account'
};

export default function SignUpPage() {
  return (
    <div className='grid h-screen place-items-center'>
      <div className='flex w-full max-w-[400px] flex-col gap-12 px-4 sm:px-0'>
        <h1 className='text-center text-2xl font-semibold tracking-wider'>
          Create new account 🙌
        </h1>
        <SignUpForm />
        <div className='flex justify-center gap-3 text-sm'>
          <span>Already have an account?</span>
          <Link href={PAGES.SIGN_IN} className='text-neutral-500 underline'>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
