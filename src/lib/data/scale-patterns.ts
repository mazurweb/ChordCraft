export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export type Note = (typeof NOTES)[number];

export const SCALE_PATTERNS = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
  harmonic_minor: [0, 2, 3, 5, 7, 8, 11],
  melodic_minor: [0, 2, 3, 5, 7, 9, 11],
  pentatonic_major: [0, 2, 4, 7, 9],
  pentatonic_minor: [0, 3, 5, 7, 10],
  blues: [0, 3, 5, 6, 7, 10],
} as const;

export type ScaleName = keyof typeof SCALE_PATTERNS;

export const SCALE_DISPLAY_NAMES: Record<ScaleName, string> = {
  major: 'Major',
  minor: 'Minor (Natural)',
  dorian: 'Dorian',
  phrygian: 'Phrygian',
  lydian: 'Lydian',
  mixolydian: 'Mixolydian',
  locrian: 'Locrian',
  harmonic_minor: 'Harmonic Minor',
  melodic_minor: 'Melodic Minor',
  pentatonic_major: 'Major Pentatonic',
  pentatonic_minor: 'Minor Pentatonic',
  blues: 'Blues',
};

export const INTERVAL_NAMES: Record<number, string> = {
  0: 'Root',
  1: 'b2',
  2: '2nd',
  3: 'b3',
  4: '3rd',
  5: '4th',
  6: 'b5',
  7: '5th',
  8: 'b6',
  9: '6th',
  10: 'b7',
  11: '7th',
};
