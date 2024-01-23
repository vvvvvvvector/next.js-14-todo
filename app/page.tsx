import { Metadata } from 'next';
import { getServerSession } from 'next-auth';

import { authOptions } from '~/lib/auth';

export const metadata: Metadata = {
  title: 'Root page 🌳'
};

export default async function RootPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className='grid h-screen place-items-center'>
      Root page 👀
      {session && (
        <div className='flex flex-col gap-5'>
          <span>{`user id: ${session.user.id}`}</span>
          <span>{`user username: ${session.user.username}`}</span>
        </div>
      )}
    </div>
  );
}
