'use client';

import { Input } from '@/components/ui/input';
import { useStudioStore } from '@/lib/store/studio-store';

export function TempoControl() {
  const { bpm, setBpm } = useStudioStore();
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5">
      <label className="text-xs text-muted-foreground" htmlFor="bpm">
        BPM
      </label>
      <Input
        id="bpm"
        type="number"
        min={60}
        max={200}
        value={bpm}
        onChange={(e) => setBpm(parseInt(e.target.value, 10) || 90)}
        className="h-7 w-16 px-2 text-sm"
      />
    </div>
  );
}
