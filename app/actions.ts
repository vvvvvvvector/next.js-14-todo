'use server';

import { revalidatePath } from 'next/cache';

import { db } from '~/lib/db';

export async function toogleDoneState(id: string, done: boolean) {
  try {
    await db.task.update({
      where: {
        id
      },
      data: {
        done
      }
    });
  } catch (e) {}

  revalidatePath('/[username]', 'page');
}

export async function deleteTaskById(id: string) {
  try {
    await db.task.delete({
      where: {
        id
      }
    });
  } catch (e) {}

  revalidatePath('/[username]', 'page');
}
