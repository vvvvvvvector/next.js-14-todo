'use client';

import { useAction } from 'next-safe-action/hooks';

import { Checkbox } from '~/components/ui/checkbox';

import { Icons } from '~/components/icons';

import { toogle } from '~/app/actions';

export function DoneCheckbox({ id, done }: { id: string; done: boolean }) {
  const { execute, status } = useAction(toogle);

  return (
    <>
      {status === 'executing' ? (
        <Icons.spinner className='size-4 animate-spin' />
      ) : (
        <Checkbox
          checked={done}
          onCheckedChange={() => {
            execute({ id, done });
          }}
        />
      )}
    </>
  );
}
