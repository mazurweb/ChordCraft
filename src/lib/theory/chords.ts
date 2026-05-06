import { NOTES, type Note } from '@/lib/data/scale-patterns';
import { CHORD_PATTERNS, type ChordType } from '@/lib/data/chord-patterns';
import { getNoteIndex } from './scales';

export function getChordNotes(rootNote: Note, chordType: ChordType): Note[] {
  const rootIndex = getNoteIndex(rootNote);
  const pattern = CHORD_PATTERNS[chordType].intervals;
  return pattern.map((interval) => NOTES[(rootIndex + interval) % 12]);
}

export function getChordSuffix(chordType: ChordType): string {
  return CHORD_PATTERNS[chordType].suffix;
}

export function buildChordName(root: Note, chordType: ChordType): string {
  return `${root}${getChordSuffix(chordType)}`;
}
