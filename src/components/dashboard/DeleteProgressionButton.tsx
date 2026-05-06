'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DeleteProgressionButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  const onDelete = async () => {
    if (!confirm('Delete this progression?')) return;
    setPending(true);
    const res = await fetch(`/api/progressions/${id}`, { method: 'DELETE' });
    setPending(false);
    if (res.ok) router.refresh();
  };

  return (
    <Button variant="outline" size="sm" onClick={onDelete} disabled={pending} aria-label="Delete">
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
