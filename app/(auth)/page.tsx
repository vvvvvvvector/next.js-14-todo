import { type Metadata } from 'next';
import Link from 'next/link';

import { Button } from '~/components/ui/button';

import { PAGES } from '~/lib/constants';

export const metadata: Metadata = {
  title: 'Root page 🌳'
};

export default function RootPage() {
  return (
    <div className='grid h-screen place-items-center'>
      <div className='grid gap-4 text-center'>
        <h3 className='text-2xl font-semibold'>Hello 😚</h3>
        <p className='text-sm'>To use the app you need to sign in</p>
        <Button asChild>
          <Link href={PAGES.SIGN_IN}>Go to the sign in page</Link>
        </Button>
      </div>
    </div>
  );
}
