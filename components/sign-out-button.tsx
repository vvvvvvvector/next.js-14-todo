'use client';

import { signOut } from 'next-auth/react';

import { Button } from '~/components/ui/button';

import { Icons } from '~/components/icons';

import { cn } from '~/lib/utils';

export function SignOutButton({ className }: { className?: string }) {
  return (
    <Button
      size='sm'
      className={cn('flex items-center', className)}
      onClick={() => {
        signOut();
      }}
    >
      <span>Sign out</span>
      <Icons.logout className='ml-2 size-4' strokeWidth={2.75} />
    </Button>
  );
}
