import { redirect } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ManageBillingButton } from '@/components/dashboard/ManageBillingButton';
import { SignOutButton } from '@/components/dashboard/SignOutButton';

export const metadata = { title: 'Settings — ChordCraft' };

export default async function SettingsPage() {
  if (!isSupabaseConfigured()) redirect('/login?redirectTo=/dashboard/settings');
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirectTo=/dashboard/settings');
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return (
    <div className="container max-w-2xl space-y-6 py-10">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Email</div>
            <div>{profile?.email}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Plan</div>
            <Badge variant={profile?.plan === 'free' ? 'outline' : 'gradient'}>
              {profile?.plan ?? 'free'}
            </Badge>
          </div>
          <div className="flex gap-2 pt-2">
            <ManageBillingButton hasCustomer={!!profile?.stripe_customer_id} />
            <SignOutButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
