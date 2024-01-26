'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAction } from 'next-safe-action/hooks';

import { Icons } from '~/components/icons';
import { EditTaskForm } from '~/components/task-form';

import { Button } from '~/components/ui/button';
import { Dialog, DialogTrigger } from '~/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';

import { deleteTask } from '~/app/actions';

export function TaskMenu({
  username,
  id,
  title,
  description,
  due
}: {
  username: string;
  id: string;
  title: string;
  description: string | null;
  due: Date | null;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const { execute, status } = useAction(deleteTask, {
    onSuccess: () => {
      setMenuOpen(false);

      toast.success('Task was successfully deleted');
    }
  });

  return (
    <Dialog>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon'>
            <Icons.more className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Icons.edit className='mr-2 size-4' />
              <span>Edit</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault(); // prevents closing after click

              execute({ id });
            }}
          >
            {status === 'executing' ? (
              <Icons.spinner className='mr-2 size-4 animate-spin text-red-500' />
            ) : (
              <Icons.delete className='mr-2 size-4 text-red-500' />
            )}
            <span className='text-red-500'>
              {status === 'executing' ? 'Loading...' : 'Delete'}
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(
                `${process.env.NEXT_PUBLIC_APP_URL}/${username}/${id}`
              );

              toast.info('The link is copied to the clipboard');
            }}
          >
            <Icons.share className='mr-2 size-4' />
            <span>Share link</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditTaskForm id={id} title={title} description={description} due={due} />
    </Dialog>
  );
}
