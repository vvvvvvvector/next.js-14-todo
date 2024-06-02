import { getServerSession } from 'next-auth';
import { createSafeActionClient } from 'next-safe-action';

import { authOptions } from '~/lib/auth';

export const action = createSafeActionClient({
  middleware: async () => {
    const session = await getServerSession(authOptions);

    return {
      userId: session?.user.id
    };
  }
});
