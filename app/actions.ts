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

    revalidatePath('/[username]', 'page');

    return {
      done: task.done
    };
  } catch (e) {
    console.log(e);
  }
});

const deleteTaskSchema = z.object({
  id: z.string()
});

export const deleteTask = action(deleteTaskSchema, async ({ id }) => {
  try {
    const task = await db.task.delete({
      where: {
        id
      },
      select: {
        id: true
      }
    });

    revalidatePath('/[username]', 'page');

    return task;
  } catch (e) {
    console.log(e);
  }
});

const createCommentSchema = z.object({
  taskId: z.string(),
  authorId: z.string(),
  text: z.string()
});

export const createComment = action(
  createCommentSchema,
  async ({ taskId, authorId, text }) => {
    try {
      const task = await db.comment.create({
        data: {
          taskId,
          senderId: authorId,
          text
        }
      });

      revalidatePath('/[username]/[taskId]', 'page');

      return task;
    } catch (e) {
      console.log(e);
    }
  }
);
