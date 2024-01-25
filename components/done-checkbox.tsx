'use client';

import { useAction } from 'next-safe-action/hooks';

import { Icons } from '~/components/icons';

import { toogle } from '~/app/actions';

import { Square, CheckSquare2 } from 'lucide-react';

export function DoneCheckbox({ id, done }: { id: string; done: boolean }) {
  const { execute, status, result } = useAction(toogle);

  // to init use done state from server component, then use return value from server action
  // it prevents flickering; doesn't wait for revalidation
  const d = result.data?.done === undefined ? done : result.data.done;

  return (
    <>
      {status === 'executing' ? (
        <Icons.spinner className='size-5 animate-spin' />
      ) : d ? (
        <CheckSquare2
          onClick={() => {
            execute({ id, done: false });
          }}
          className='size-5'
        />
      ) : (
        <Square
          onClick={() => {
            execute({ id, done: true });
          }}
          className='size-5'
        />
      )}
    </>
  );
}
