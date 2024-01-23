import { getServerSession } from 'next-auth';

import { SignOutButton } from '~/components/sign-out-button';

import { authOptions } from '~/lib/auth';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className='grid h-screen place-items-center'>
      Home page 🏡
      {session && (
        <div className='flex flex-col gap-5'>
          <span>{`user id: ${session.user.id}`}</span>
          <span>{`user username: ${session.user.username}`}</span>
          <SignOutButton />
        </div>
      )}
    </div>
  );
}
