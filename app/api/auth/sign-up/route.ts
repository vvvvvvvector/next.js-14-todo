import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  // sign up logic, bcrypt...

  return NextResponse.json({
    message: 'hello world!'
  });
}
