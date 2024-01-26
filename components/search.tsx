'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

import { Input } from '~/components/ui/input';

export const QUERY_NAME = 'q';

export function Search() {
  const searchParams = useSearchParams();

  const pathname = usePathname();

  const { replace } = useRouter();

  const debounced = useDebouncedCallback((searchInput: string) => {
    const params = new URLSearchParams(searchParams);

    if (searchInput) {
      params.set(QUERY_NAME, searchInput);
    } else {
      params.delete(QUERY_NAME);
    }

    replace(`${pathname}?${params.toString()}`);
  }, 400);

  return (
    <Input
      defaultValue={searchParams.get(QUERY_NAME)?.toString()}
      className='max-w-[350px]'
      placeholder='title or description...'
      onChange={(e) => debounced(e.target.value)}
    />
  );
}
