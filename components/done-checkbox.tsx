'use client';

import { useAction } from 'next-safe-action/hooks';

import { Icons } from '~/components/icons';

import { toogle } from '~/app/actions';
import { toast } from 'sonner';

export function DoneCheckbox({ id, done }: { id: string; done: boolean }) {
  const { execute, status, result } = useAction(toogle, {
    onSuccess: (data) => {
      if (data && 'failure' in data) {
        toast.error(data.failure);
      }
    }
  });

  // to init use done state from server component, then use return value from server action
  // it prevents flickering; doesn't wait for revalidation
  const d = result.data?.done === undefined ? done : result.data.done;

  return (
    <>
      {status === 'executing' ? (
        <Icons.spinner className='size-5 animate-spin' />
      ) : d ? (
        <Icons.checkedSquare
          onClick={() => {
            execute({ id, done: false });
          }}
          className='size-5'
        />
      ) : (
        <Icons.square
          onClick={() => {
            execute({ id, done: true });
          }}
          className='size-5'
        />
      )}
    </>
  );
}
