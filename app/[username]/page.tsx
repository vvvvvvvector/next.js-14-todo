import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';

import { Separator } from '~/components/ui/separator';

import { db } from '~/lib/db';
import { formatDate } from '~/lib/utils';
import { authOptions } from '~/lib/auth';
import { PAGES } from '~/lib/constants';

import { DoneCheckbox } from '~/components/done-checkbox';
import { TaskMenu } from '~/components/task-menu';
import { Search } from '~/components/search';
import { Icons } from '~/components/icons';
import { CreateTaskForm } from '~/components/task-form';

export const metadata: Metadata = {
  title: 'Home page 🏡'
};

async function getMyTasks(searchValue: string = '') {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(PAGES.SIGN_IN);
  }

  const tasks = await db.task.findMany({
    where: {
      authorId: session.user.id,
      OR: [
        {
          title: {
            contains: searchValue
          }
        },
        {
          description: {
            contains: searchValue
          }
        }
      ]
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      gh: {
        select: {
          fullName: true
        }
      },
      _count: {
        select: {
          comments: true
        }
      }
    }
  });

  return tasks;
}

export default async function HomePage({
  params,
  searchParams
}: {
  params: {
    username: string;
  };
  searchParams: {
    q: string;
  };
}) {
  const tasks = await getMyTasks(searchParams.q);

  return (
    <div className='flex w-full max-w-[650px] flex-col gap-6'>
      <div className='flex items-center justify-between gap-3'>
        <Search />
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
              className='flex items-center gap-2 rounded-md border p-3'
            >
              <DoneCheckbox id={task.id} done={task.done} />
              <Link
                className='flex-1 overflow-hidden rounded-md p-2 hover:bg-accent'
                href={`/${params.username}/${task.id}`}
              >
                <div className='flex flex-1 flex-col gap-1'>
                  <h4 className='font-semibold'>{task.title}</h4>
                  <span className='max-h-[20px] overflow-hidden text-ellipsis'>
                    {task.description || 'no description'}
                  </span>
                  {!!task.due ? (
                    <time className='flex items-center gap-1'>
                      <Icons.calendarClock className='size-4 flex-shrink-0' />
                      <span className='sm:hidden'>{`${formatDate(task.due.toString(), 'short')}`}</span>
                      <span className='hidden sm:block'>{`${formatDate(task.due.toString())}`}</span>
                    </time>
                  ) : (
                    <span>no due date</span>
                  )}
                  {task.gh ? (
                    <span className='flex items-center gap-1'>
                      <Icons.github className='size-4 flex-shrink-0' />
                      <span className='overflow-hidden text-ellipsis text-nowrap'>
                        {task.gh.fullName}
                      </span>
                    </span>
                  ) : (
                    <span>no linked repo</span>
                  )}
                  {task._count.comments > 0 ? (
                    <span className='flex items-center gap-1'>
                      <Icons.comments className='size-4' />
                      <span>{task._count.comments}</span>
                    </span>
                  ) : (
                    <span>no comments</span>
                  )}
                </div>
              </Link>
              <TaskMenu {...task} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
