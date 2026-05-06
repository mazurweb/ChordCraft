import Link from 'next/link';
import { redirect } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db, isDbConfigured } from '@/lib/db/client';
import { progressions, users } from '@/lib/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DeleteProgressionButton } from '@/components/dashboard/DeleteProgressionButton';

export const metadata = { title: 'Dashboard — ChordCraft' };

export default async function DashboardPage() {
  if (!isDbConfigured()) redirect('/login?redirectTo=/dashboard');
  const session = await auth();
  if (!session?.user?.id) redirect('/login?redirectTo=/dashboard');

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  const rows = await db
    .select()
    .from(progressions)
    .where(eq(progressions.userId, session.user.id))
    .orderBy(desc(progressions.createdAt));

  return (
    <div className="container space-y-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your progressions</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/settings">
            <Button variant="outline">Settings</Button>
          </Link>
          <Link href="/studio">
            <Button variant="gradient">Open Studio</Button>
          </Link>
        </div>
      </div>

      {rows.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle>{p.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="font-mono text-xs text-muted-foreground">
                  {p.chords.chords.join(' → ')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {p.genre} · {p.key} {p.scale} · {p.bpm} BPM
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  {p.isPublic && <Badge variant="secondary">public</Badge>}
                  <DeleteProgressionButton id={p.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No saved progressions yet. Build one in the{' '}
          <Link href="/studio" className="text-brand-orange">Studio</Link>.
        </div>
      )}
    </div>
  );
}
