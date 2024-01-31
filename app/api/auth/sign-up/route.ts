import * as bcrypt from 'bcrypt';

import { db } from '~/lib/db';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const user = await db.user.findUnique({
      where: {
        username
      }
    });

    if (user) {
      return Response.json({
        success: false,
        message: 'User already exists'
      });
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    await db.user.create({
      data: {
        username,
        password: hash
      }
    });

    return Response.json({
      success: true,
      message: 'User was successfully created.'
    });
  } catch (e) {
    console.log(e);

    return Response.json({
      success: false,
      message: 'Error occured while signing up!'
    });
  }
}
