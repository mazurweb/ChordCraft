'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'At least 8 characters'),
});
type FormValues = z.infer<typeof schema>;

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [sent, setSent] = React.useState(false);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      ...values,
      options: { emailRedirectTo: `${location.origin}/auth/callback?next=/dashboard` },
    });
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-md border border-border bg-secondary p-4 text-sm">
        Check your email for a confirmation link to finish signup.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register('email')} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" variant="gradient" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creating…' : 'Create account'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-orange">
          Sign in
        </Link>
      </p>
    </form>
  );
}
