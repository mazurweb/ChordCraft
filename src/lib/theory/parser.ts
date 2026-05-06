import type { Note } from '@/lib/data/scale-patterns';
import type { ChordType } from '@/lib/data/chord-patterns';

const FLAT_MAP: Record<string, Note> = {
  Db: 'C#',
  Eb: 'D#',
  Gb: 'F#',
  Ab: 'G#',
  Bb: 'A#',
};

export interface ParsedChord {
  root: Note;
  type: ChordType;
}

export function parseChordName(chordStr: string): ParsedChord | null {
  const match = chordStr.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return null;

  let root = match[1] as string;
  const suffix = match[2].toLowerCase();

  if (root.endsWith('b') && FLAT_MAP[root]) {
    root = FLAT_MAP[root];
  }

  let type: ChordType = 'maj';
  if (suffix.includes('maj9')) type = 'maj9';
  else if (suffix.includes('maj7')) type = 'maj7';
  else if (suffix.includes('m9')) type = 'min9';
  else if (suffix.includes('m7')) type = 'min7';
  else if (suffix.includes('add9')) type = 'add9';
  else if (suffix.includes('9')) type = 'dom7';
  else if (suffix.includes('7')) type = 'dom7';
  else if (suffix.includes('dim')) type = 'dim';
  else if (suffix.includes('aug')) type = 'aug';
  else if (suffix.includes('sus2')) type = 'sus2';
  else if (suffix.includes('sus4')) type = 'sus4';
  else if (suffix.startsWith('m') && !suffix.startsWith('maj')) type = 'min';

  return { root: root as Note, type };
}
