'use client';

import { toast } from 'sonner';

import { Icons } from '~/components/icons';

import { DropdownMenuItem } from '~/components/ui/dropdown-menu';

export function ShareLinkButton({
  username,
  taskId
}: {
  username: string;
  taskId: string;
}) {
  return (
    <DropdownMenuItem
      onClick={() => {
        navigator.clipboard.writeText(
          `${process.env.NEXT_PUBLIC_APP_URL}/${username}/${taskId}`
        );

        toast.info('The link is copied to the clipboard');
      }}
    >
      <Icons.share className='mr-2 size-4' />
      <span>Share link</span>
    </DropdownMenuItem>
  );
}
