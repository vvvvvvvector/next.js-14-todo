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

async function getTask(username: string, taskId: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(PAGES.SIGN_IN);
  }

  const task = await db.task.findUnique({
    where: {
      author: {
        username
      },
      id: taskId
    }
  });

  // I'm appologizing
  return {
    task,
    sessionUsername: session.user.username
  };
}

export default async function TaskPage({
  params
}: {
  params: {
    username: string;
    taskId: string;
  };
}) {
  const { task, sessionUsername } = await getTask(
    params.username,
    params.taskId
  );

  return (
    <Card className='w-full max-w-[625px]'>
      {task ? (
        <>
          <CardHeader>
            <CardTitle>{task.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid w-full items-center gap-4'>
              <Textarea
                className='max-h-80'
                readOnly
                value={task.description || 'no description'}
              />
              {params.username !== sessionUsername && (
                <Badge className='w-max'>{`${params.username} shared the task with you 🤝`}</Badge>
              )}
              {!!task.due ? (
                <time className='flex items-center gap-2 text-sm'>
                  <Icons.calendarClock className='size-4' />
                  <span className='sm:hidden'>{`${formatDate(task.due.toString(), 'short')}`}</span>
                  <span className='hidden sm:block'>{`${formatDate(task.due.toString())}`}</span>
                </time>
              ) : (
                <span className='text-sm'>no due date</span>
              )}
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
          <Link href={`/${sessionUsername}`}>Go back</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
