import { NOTES, SCALE_PATTERNS, type Note, type ScaleName } from '@/lib/data/scale-patterns';

export function getNoteIndex(note: Note): number {
  return NOTES.indexOf(note);
}

export function getScaleNotes(rootNote: Note, scale: ScaleName): Note[] {
  const rootIndex = getNoteIndex(rootNote);
  const pattern = SCALE_PATTERNS[scale];
  return pattern.map((interval) => NOTES[(rootIndex + interval) % 12]);
}
