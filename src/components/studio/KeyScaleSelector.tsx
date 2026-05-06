'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useStudioStore } from '@/lib/store/studio-store';
import { NOTES, SCALE_DISPLAY_NAMES, type Note, type ScaleName } from '@/lib/data/scale-patterns';

export function KeyScaleSelector() {
  const { key, scale, setKey, setScale } = useStudioStore();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Key</Label>
        <Select value={key} onValueChange={(v) => setKey(v as Note)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NOTES.map((n) => (
              <SelectItem key={n} value={n}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Scale / Mode</Label>
        <Select value={scale} onValueChange={(v) => setScale(v as ScaleName)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SCALE_DISPLAY_NAMES).map(([id, name]) => (
              <SelectItem key={id} value={id}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
