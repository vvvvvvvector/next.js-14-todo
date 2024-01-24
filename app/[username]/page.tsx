import { getServerSession } from 'next-auth';

import { SignOutButton } from '~/components/sign-out-button';

import { authOptions } from '~/lib/auth';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className='relative grid h-screen place-items-center'>
      {session && (
        <div className='flex flex-col gap-5'>
          Home page 🏡
          <span>{`user id: ${session.user.id}`}</span>
          <span>{`user username: ${session.user.username}`}</span>
        </div>
      )}
      <SignOutButton className='absolute right-5 top-5' />
    </div>
  );
}
