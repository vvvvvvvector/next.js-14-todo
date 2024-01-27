import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import { z } from 'zod';

import { authOptions } from '~/lib/auth';
import { db } from '~/lib/db';

const createTaskSchema = z.object({
  title: z.string(),
  description: z.string().nullish(),
  due: z.string().nullish()
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({
        success: false,
        message: 'Your session has expired. To use the app sign in again'
      });
    }

    const json = await request.json();
    const body = createTaskSchema.parse(json);

    await db.task.create({
      data: {
        title: body.title,
        description: body.description,
        due: body.due,
        authorId: session.user.id
      }
    });

    return Response.json({
      success: true,
      message: 'A new task was successfully created'
    });
  } catch (e) {
    return Response.json({
      success: false,
      message: 'Error occured while create a task!'
    });
  }
}
