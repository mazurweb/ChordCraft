import { parseChordName } from './parser';
import { getChordNotes } from './chords';
import type { Note } from '@/lib/data/scale-patterns';

export function expandProgression(chordStrs: string[]): { name: string; notes: Note[] }[] {
  return chordStrs.flatMap((s) => {
    const parsed = parseChordName(s);
    if (!parsed) return [];
    return [{ name: s, notes: getChordNotes(parsed.root, parsed.type) }];
  });
}
