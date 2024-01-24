import { type Metadata } from 'next';

import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog';

import { Icons } from '~/components/icons';
import { SignOutButton } from '~/components/sign-out-button';
import { CreateTaskForm } from '~/components/create-task-form';

export const metadata: Metadata = {
  title: 'Home page 🏡'
};

export default async function HomePage() {
  return (
    <div className='relative grid h-screen place-items-center'>
      <div className='w-full max-w-[500px]'>
        <div className='flex items-center justify-between'>
          <span className='font-semibold'>Sort</span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='outline' size='icon'>
                <Icons.plus className='size-4' />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new task</DialogTitle>
              </DialogHeader>
              <CreateTaskForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <SignOutButton className='absolute right-5 top-5' />
    </div>
  );
}
