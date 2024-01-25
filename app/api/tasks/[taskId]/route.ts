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
      return new Response('Unauthorized', { status: 403 });
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

    return new Response(null, { status: 200 });
  } catch (e) {
    return new Response(null, { status: 500 });
  }
}
