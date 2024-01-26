'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Button } from '~/components/ui/button';

export function TaskNotFound() {
  const params = useParams();

  return (
    <Button asChild>
      <Link href={`/${params.username}`}>Return home</Link>
    </Button>
  );
}
