'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '~/lib/auth';
import { db } from '~/lib/db';

export async function getMyTasks() {
  const session = await getServerSession(authOptions);

  const tasks = await db.task.findMany({
    where: {
      authorId: session?.user.id
    }
  });

  return tasks;
}
