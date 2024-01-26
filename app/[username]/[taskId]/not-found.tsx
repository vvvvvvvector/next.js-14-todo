import { TaskNotFound } from '~/components/task-not-found';

export default function NotFound() {
  return (
    <div className='grid gap-7 text-center'>
      <h2 className='text-2xl font-semibold'>Task not found</h2>
      <span className='text-3xl'>😓</span>
      <TaskNotFound />
    </div>
  );
}
