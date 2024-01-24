import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { z } from 'zod';

import { authOptions } from '~/lib/auth';
import { db } from '~/lib/db';

export const createTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  due: z.string().optional()
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response('Unauthorized', { status: 403 });
  }

  const json = await request.json();
  const body = createTaskSchema.parse(json);

  const { id } = await db.task.create({
    data: {
      title: body.title,
      description: body.description,
      due: body.due,
      authorId: session.user.id
    },
    select: {
      id: true
    }
  });

  return Response.json(id);
}
