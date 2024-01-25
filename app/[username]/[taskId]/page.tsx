import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Icons } from '~/components/icons';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { Badge } from '~/components/ui/badge';

import { authOptions } from '~/lib/auth';
import { db } from '~/lib/db';
import { formatDate } from '~/lib/utils';
import { PAGES } from '~/lib/constants';

export default async function TaskPage({
  params
}: {
  params: {
    username: string;
    taskId: string;
  };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(PAGES.SIGN_IN);
  }

  const task = await db.task.findUnique({
    where: {
      author: {
        username: params.username
      },
      id: params.taskId
    }
  });

  return (
    <Card className='w-full max-w-[625px]'>
      {task ? (
        <>
          <CardHeader>
            <CardTitle>{`${task.title}`}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid w-full items-center gap-4'>
              <Textarea
                className='max-h-80'
                readOnly
                value={task.description || 'no description'}
              />
              {params.username !== session.user.username && (
                <Badge className='w-max'>{`${params.username} shared the task with you 🤝`}</Badge>
              )}
              <div className='flex items-center justify-between text-sm'>
                {!!task.due ? (
                  <time className='flex items-center gap-2 '>
                    <Icons.calendarClock className='size-4' />
                    <span className='sm:hidden'>{`${formatDate(task.due.toString(), 'short')}`}</span>
                    <span className='hidden sm:block'>{`${formatDate(task.due.toString())}`}</span>
                  </time>
                ) : (
                  <span>no due date</span>
                )}
                <span>{`Done status: ${task.done ? 'done ✅' : 'in progress ⏳'}`}</span>
              </div>
            </div>
          </CardContent>
        </>
      ) : (
        <CardHeader>
          <CardTitle>Task not found</CardTitle>
        </CardHeader>
      )}
      <CardFooter>
        <Button variant='outline' asChild>
          <Link href={`/${session.user.username}`}>Go back</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
