import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import { z } from 'zod';

import { authOptions } from '~/lib/auth';
import { db } from '~/lib/db';

const routeContextSchema = z.object({
  params: z.object({
    taskId: z.string()
  })
});

const updateTaskSchema = z.object({
  title: z.string(),
  description: z.string().nullish(),
  due: z.string().nullish()
});

export async function PATCH(
  request: NextRequest,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({
        success: false,
        message: 'Your session has expired. To use the app sign in again'
      });
    }

    const { params } = routeContextSchema.parse(context);

    const json = await request.json();
    const body = updateTaskSchema.parse(json);

    await db.task.update({
      data: {
        title: body.title,
        description: body.description,
        due: body.due
      },
      where: {
        id: params.taskId
      }
    });

    return Response.json({
      success: true,
      message: 'The task was successfully updated'
    });
  } catch (e) {
    return Response.json({
      success: false,
      message: 'Error occured while updating the task!'
    });
  }
}
