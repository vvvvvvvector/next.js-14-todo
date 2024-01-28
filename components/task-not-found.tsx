'use client';

import Link from 'next/link';

import { Button } from '~/components/ui/button';

import { PAGES } from '~/lib/constants';

export function TaskNotFound() {
  return (
    <Button asChild>
      <Link href={PAGES.SIGN_IN}>Return home</Link>
    </Button>
  );
}
