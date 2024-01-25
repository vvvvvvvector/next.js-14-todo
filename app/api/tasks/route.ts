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
      return new Response('Unauthorized', { status: 403 });
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

    return new Response(null, { status: 200 });
  } catch (e) {
    return new Response(null, { status: 500 });
  }
}
