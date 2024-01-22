'use client';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

export function SignInForm() {
  return (
    <div className='grid gap-10'>
      <form>
        <div className='grid gap-10'>
          <div className='grid gap-2'>
            <Label htmlFor='username'>Username</Label>
            <Input
              id='username'
              placeholder='ex@mple1234'
              type='text'
              autoCapitalize='none'
              autoCorrect='off'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              placeholder='strong password'
              type='password'
              autoCapitalize='none'
              autoCorrect='off'
            />
          </div>
        </div>
      </form>
      <Button>Sign in</Button>
    </div>
  );
}
