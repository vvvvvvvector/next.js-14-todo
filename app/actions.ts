'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import { db } from '~/lib/db';
import { action } from '~/lib/safe-action';

const doneSchema = z.object({
  id: z.string(),
  done: z.boolean()
});

export const toogle = action(doneSchema, async ({ id, done }) => {
  try {
    const task = await db.task.update({
      where: {
        id
      },
      data: {
        done
      }
    });

    return {
      done: task.done
    };
  } catch (e) {}

  revalidatePath('/[username]', 'page');
});

const deleteTaskSchema = z.object({
  id: z.string()
});

export const deleteTask = action(deleteTaskSchema, async ({ id }) => {
  try {
    await db.task.delete({
      where: {
        id
      }
    });
  } catch (e) {}

  revalidatePath('/[username]', 'page');
});
