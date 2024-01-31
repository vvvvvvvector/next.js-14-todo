'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAction } from 'next-safe-action/hooks';
import { useParams } from 'next/navigation';

import { Icons } from '~/components/icons';
import { EditTaskForm } from '~/components/task-form';
import { LinkRepoForm } from '~/components/link-repo-form';

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
  id,
  title,
  description,
  due
}: {
  id: string;
  title: string;
  description: string | null;
  due: Date | null;
}) {
  const params = useParams();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [dialog, setDialog] = useState<'edit' | 'gh-link'>('edit');

  const { execute, status } = useAction(deleteTask, {
    onSuccess: (data) => {
      if (data && 'failure' in data) {
        toast.error(data.failure);
        return;
      }

      setMenuOpen(false);

      toast.success('Task was successfully deleted');
    }
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon'>
            <Icons.more className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger onClick={() => setDialog('edit')} asChild>
            <DropdownMenuItem>
              <Icons.edit className='mr-2 size-4' />
              <span>Edit</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger onClick={() => setDialog('gh-link')} asChild>
            <DropdownMenuItem>
              <Icons.link className='mr-2 size-4' />
              <span>Link repo</span>
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
                `${process.env.NEXT_PUBLIC_APP_URL}/${params.username}/${id}`
              );

              toast.info('The link is copied to the clipboard');
            }}
          >
            <Icons.share className='mr-2 size-4' />
            <span>Share link</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialog === 'edit' && (
        <EditTaskForm
          setDialogOpen={setDialogOpen}
          id={id}
          title={title}
          description={description}
          due={due}
        />
      )}
      {dialog === 'gh-link' && (
        <LinkRepoForm setDialogOpen={setDialogOpen} id={id} />
      )}
    </Dialog>
  );
}
