import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db, isDbConfigured } from '@/lib/db/client';
import { users } from '@/lib/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SignOutButton } from '@/components/dashboard/SignOutButton';

export const metadata = { title: 'Settings — ChordCraft' };

export default async function SettingsPage() {
  if (!isDbConfigured()) redirect('/login?redirectTo=/dashboard/settings');
  const session = await auth();
  if (!session?.user?.id) redirect('/login?redirectTo=/dashboard/settings');

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);

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
            <div>{user?.email}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Plan</div>
            <Badge variant="gradient">Beta — all features</Badge>
          </div>
          <div className="flex gap-2 pt-2">
            <SignOutButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
