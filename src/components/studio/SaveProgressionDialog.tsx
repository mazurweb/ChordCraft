'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useStudioStore } from '@/lib/store/studio-store';

export function SaveProgressionDialog({ children }: { children: React.ReactNode }) {
  const { activeProgression, key, scale, bpm, genre } = useStudioStore();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [isPublic, setIsPublic] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    if (open && activeProgression && !name) setName(activeProgression.name);
  }, [open, activeProgression, name]);

  const onSave = async () => {
    if (!activeProgression) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/progressions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || activeProgression.name,
          genre,
          key,
          scale,
          bpm,
          chords: activeProgression.chords,
          roman: activeProgression.roman,
          is_public: isPublic,
        }),
      });
      if (res.status === 401) {
        router.push('/login?redirectTo=/studio');
        return;
      }
      if (!res.ok) {
        setError((await res.text()) || 'Save failed');
        return;
      }
      setOpen(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save progression</DialogTitle>
          <DialogDescription>
            Saved progressions appear in your dashboard. Free tier is limited to 3 saves.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="prog-name">Name</Label>
            <Input
              id="prog-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My phonk loop"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4"
            />
            Make public (shareable link)
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} size="sm">
            Cancel
          </Button>
          <Button variant="gradient" onClick={onSave} disabled={saving} size="sm">
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
