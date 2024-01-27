'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { authOptions } from '~/lib/auth';
import { db } from '~/lib/db';
import { action } from '~/lib/safe-action';

const doneSchema = z.object({
  id: z.string(),
  done: z.boolean()
});

const SESSION_EXPIRED_MESSAGE =
  'Your session has expired. To use the app sign in again';

export const toogle = action(doneSchema, async ({ id, done }) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return {
        failure: SESSION_EXPIRED_MESSAGE
      };
    }

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

    return {
      failure: 'Error occurred while toggling the done state!'
    };
  }
});

const deleteTaskSchema = z.object({
  id: z.string()
});

export const deleteTask = action(deleteTaskSchema, async ({ id }) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return {
        failure: SESSION_EXPIRED_MESSAGE
      };
    }

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

    return {
      failure: 'Error occurred while deleting the task!'
    };
  }
});

const createCommentSchema = z.object({
  taskId: z.string(),
  text: z.string()
});

export const createComment = action(
  createCommentSchema,
  async ({ taskId, text }) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session) {
        return {
          failure: SESSION_EXPIRED_MESSAGE
        };
      }

      const task = await db.comment.create({
        data: {
          taskId,
          senderId: session.user.id,
          text
        }
      });

      revalidatePath('/[username]/[taskId]', 'page');

      return task;
    } catch (e) {
      console.log(e);

      return {
        failure: 'Error occurred while creating the comment!'
      };
    }
  }
);
