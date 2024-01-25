import { SignOutButton } from '~/components/sign-out-button';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className='flex flex-col gap-5'>
      <header className='flex justify-end p-5'>
        <SignOutButton />
      </header>
      <main className='flex justify-center px-5 pb-10'>{children}</main>
    </div>
  );
}
