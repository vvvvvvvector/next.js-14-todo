import { type Metadata } from 'next';
import { getServerSession } from 'next-auth';

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
import { Dialog, DialogTrigger } from '~/components/ui/dialog';

import { Icons } from '~/components/icons';
import { EditTaskForm, CreateTaskForm } from '~/components/task-form';

import { db } from '~/lib/db';
import { formatDate } from '~/lib/utils';
import { authOptions } from '~/lib/auth';

import { deleteTaskById, toogleDoneState } from '~/app/actions';

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
                onCheckedChange={toogleDoneState.bind(
                  null,
                  task.id,
                  !task.done
                )}
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
              <Dialog>
                <DropdownMenu>
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
                    <form action={deleteTaskById.bind(null, task.id)}>
                      <button className='w-full' type='submit'>
                        <DropdownMenuItem>
                          <Icons.delete className='mr-2 size-4 text-red-500' />
                          <span className='text-red-500'>Delete</span>
                        </DropdownMenuItem>
                      </button>
                    </form>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Icons.share className='mr-2 size-4' />
                      <span>Share link</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <EditTaskForm
                  taskId={task.id}
                  title={task.title}
                  description={task.description}
                  due={task.due}
                />
              </Dialog>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
