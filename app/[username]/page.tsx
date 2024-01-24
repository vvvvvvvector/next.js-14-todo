import { type Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { Separator } from '~/components/ui/separator';
import { Checkbox } from '~/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';

import { CreateTaskForm } from '~/components/create-task-form';
import { Icons } from '~/components/icons';

import { db } from '~/lib/db';
import { formatDate } from '~/lib/utils';
import { authOptions } from '~/lib/auth';

export const metadata: Metadata = {
  title: 'Home page 🏡'
};

export async function getMyTasks() {
  const session = await getServerSession(authOptions);

  const tasks = await db.task.findMany({
    where: {
      authorId: session?.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return tasks;
}

export default async function HomePage() {
  const tasks = await getMyTasks();

  return (
    <div className='flex w-full max-w-[625px] flex-col gap-6 px-5'>
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
              className='flex cursor-pointer items-center gap-4 rounded-md border p-4'
              key={task.id}
            >
              <Checkbox
                checked={task.done}
                onCheckedChange={async (state) => {
                  'use server';

                  await db.task.update({
                    where: {
                      id: task.id
                    },
                    data: {
                      done: state === true ? true : false
                    }
                  });

                  revalidatePath('/[username]', 'page');
                }}
              />
              <div className='flex flex-1 flex-col gap-2 overflow-hidden'>
                <h4 className='font-semibold'>{task.title}</h4>
                <span className='max-h-[20px] overflow-hidden text-ellipsis'>
                  {!task.description ? 'no description' : task.description}
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <Icons.more className='size-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Icons.edit className='mr-2 size-4' />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icons.share className='mr-2 size-4' />
                    <span>Share link</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <form
                    action={async () => {
                      'use server';

                      await db.task.delete({
                        where: {
                          id: task.id
                        }
                      });

                      revalidatePath('/[username]', 'page');
                    }}
                  >
                    <button className='w-full' type='submit'>
                      <DropdownMenuItem>
                        <Icons.delete className='mr-2 size-4 text-red-500' />
                        <span className='text-red-500'>Delete</span>
                      </DropdownMenuItem>
                    </button>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
