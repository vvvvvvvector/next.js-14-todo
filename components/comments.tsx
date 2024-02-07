'use client';

import { useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';

import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

import { Icons } from '~/components/icons';

import { createComment } from '~/app/actions';

import { cn, formatDate, formatTime } from '~/lib/utils';

export function Comments({
  id,
  comments
}: {
  id: string;
  comments: {
    id: string;
    text: string;
    createdAt: Date;
    sender: {
      username: string;
    };
  }[];
}) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState('');

  const { execute, status } = useAction(createComment, {
    onSuccess: (data) => {
      if (data && 'failure' in data) {
        toast.error(data.failure);
        return;
      }

      toast.success('Comment was successfully sent');
    }
  });

  const onSend = () => {
    execute({ text: comment, taskId: id });

    setComment('');
  };

  return (
    <>
      <button
        className='flex items-center gap-2'
        onClick={() => setOpen(!open)}
      >
        <span className='font-bold'>{`Comments (${comments.length})`}</span>
        <Icons.arrowDown
          className={cn('size-4 transition-transform duration-500', {
            '-rotate-180': open
          })}
        />
      </button>
      {open && (
        <div className='flex flex-col gap-4'>
          <ul className='flex flex-col gap-5'>
            {comments.length > 0 ? (
              <>
                {comments.map((comment) => (
                  <li key={comment.id}>
                    <div className='flex flex-col gap-1'>
                      <span className='flex justify-between gap-2'>
                        <span className='font-semibold'>
                          {comment.sender.username}
                        </span>
                        <time
                          suppressHydrationWarning
                        >{`${formatDate(comment.createdAt.toString())} at ${formatTime(comment.createdAt.toString())}`}</time>
                      </span>
                      <span>{comment.text}</span>
                    </div>
                  </li>
                ))}
              </>
            ) : (
              <li>no comments</li>
            )}
          </ul>
          <div className='flex gap-4'>
            <Input
              type='text'
              className='flex-1'
              placeholder='Your comment...'
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
              onKeyDown={(e) => {
                const commandOrCtrlPlusEnter =
                  (e.metaKey || e.ctrlKey) && e.key === 'Enter';

                if (commandOrCtrlPlusEnter && comment) {
                  e.preventDefault();

                  onSend();
                }
              }}
            />
            <Button
              disabled={status === 'executing' || comment.length === 0}
              onClick={onSend}
              size='icon'
            >
              {status === 'executing' ? (
                <Icons.spinner className='size-4 animate-spin' />
              ) : (
                <Icons.send className='size-4' />
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
