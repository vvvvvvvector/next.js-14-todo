'use client';

import { useState } from 'react';
import { useAction } from 'next-safe-action/hooks';

import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

import { Icons } from '~/components/icons';

import { createComment } from '~/app/actions';
import { toast } from 'sonner';

export function Comments({
  taskId,
  authorId,
  comments
}: {
  taskId: string;
  authorId: string;
  comments: {
    id: string;
    sender: {
      username: string;
    };
    text: string;
    createdAt: Date;
  }[];
}) {
  const [comment, setComment] = useState('');

  const { execute, status } = useAction(createComment, {
    onSuccess: () => {
      toast.success('Comment was successfully sent');
    }
  });

  const onSend = () => {
    execute({ text: comment, taskId, authorId });

    setComment('');
  };

  return (
    <div className='flex flex-col gap-4'>
      <h4 className='font-bold'>Comments:</h4>
      <ul className='flex flex-col gap-5'>
        {comments.map((comment) => (
          <li key={comment.id}>
            <div className='flex flex-col gap-1'>
              <span className='font-semibold'>{comment.sender.username}</span>
              <span>{comment.text}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className='flex gap-4'>
        <Input
          value={comment}
          type='text'
          placeholder='comment...'
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
        <Button disabled={status === 'executing'} onClick={onSend} size='icon'>
          {status === 'executing' ? (
            <Icons.spinner className='size-4 animate-spin' />
          ) : (
            <Icons.send className='size-4' />
          )}
        </Button>
      </div>
    </div>
  );
}
