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

const linkRepoSchema = z.object({
  taskId: z.string(),
  link: z
    .string()
    .min(1, { message: 'There is no link' })
    .regex(new RegExp('https://github.com/.*/.*'), {
      message: `It's not a github repo link 😡`
    })
});

export const linkRepo = action(linkRepoSchema, async ({ link, taskId }) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return {
        failure: SESSION_EXPIRED_MESSAGE
      };
    }

    const splitted = link.split('/');

    const repoName = splitted[splitted.length - 1];
    const ownerName = splitted[splitted.length - 2];
    const fullName = `${ownerName}/${repoName}`;

    const repo = await db.repo.upsert({
      where: {
        taskId
      },
      update: {
        repoName,
        owner: ownerName,
        fullName
      },
      create: {
        taskId: taskId,
        repoName,
        owner: ownerName,
        fullName
      }
    });

    revalidatePath('/[username]', 'page');

    return repo;
  } catch (e) {
    console.log(e);

    return {
      failure: 'Error occurred while linking the repo!'
    };
  }
});
