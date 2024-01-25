import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';

import { Separator } from '~/components/ui/separator';

import { Icons } from '~/components/icons';
import { CreateTaskForm } from '~/components/task-form';

import { db } from '~/lib/db';
import { formatDate } from '~/lib/utils';
import { authOptions } from '~/lib/auth';
import { PAGES } from '~/lib/constants';

import { DoneCheckbox } from '~/components/done-checkbox';
import { TaskMenu } from '~/components/task-menu';

export const metadata: Metadata = {
  title: 'Home page 🏡'
};

async function getMyTasks() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(PAGES.SIGN_IN);
  }

  const tasks = await db.task.findMany({
    where: {
      authorId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return tasks;
}

export default async function HomePage({
  params
}: {
  params: {
    username: string;
  };
}) {
  const tasks = await getMyTasks();

  return (
    <div className='flex w-full max-w-[625px] flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <span className='font-semibold'>Sort</span>
        <CreateTaskForm />
      </div>
      <Separator />
      {tasks.length === 0 ? (
        <span className='text-center text-sm'>you have no tasks yet 🥲</span>
      ) : (
        <ul className='flex flex-col gap-3 text-sm'>
          {tasks.map((task) => (
            <li
              key={task.id}
              className='flex cursor-pointer items-center gap-2 rounded-md border p-4'
            >
              <DoneCheckbox id={task.id} done={task.done} />
              <Link
                className='flex-1 overflow-hidden rounded-md p-2 hover:bg-accent'
                href={`/${params.username}/${task.id}`}
              >
                <div className='flex flex-1 flex-col gap-2'>
                  <h4 className='font-semibold'>{task.title}</h4>
                  <span className='max-h-[20px] overflow-hidden text-ellipsis'>
                    {task.description || 'no description'}
                  </span>
                  {!!task.due ? (
                    <time className='flex items-center gap-2'>
                      <Icons.calendarClock className='size-4' />
                      <span className='sm:hidden'>{`${formatDate(task.due.toString(), 'short')}`}</span>
                      <span className='hidden sm:block'>{`${formatDate(task.due.toString())}`}</span>
                    </time>
                  ) : (
                    <span>no due date</span>
                  )}
                </div>
              </Link>
              <TaskMenu {...task} username={params.username} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
