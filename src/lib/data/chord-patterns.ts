export const CHORD_PATTERNS = {
  maj: { intervals: [0, 4, 7], suffix: '' },
  min: { intervals: [0, 3, 7], suffix: 'm' },
  dim: { intervals: [0, 3, 6], suffix: 'dim' },
  aug: { intervals: [0, 4, 8], suffix: 'aug' },
  sus2: { intervals: [0, 2, 7], suffix: 'sus2' },
  sus4: { intervals: [0, 5, 7], suffix: 'sus4' },
  maj7: { intervals: [0, 4, 7, 11], suffix: 'maj7' },
  min7: { intervals: [0, 3, 7, 10], suffix: 'm7' },
  dom7: { intervals: [0, 4, 7, 10], suffix: '7' },
  maj9: { intervals: [0, 4, 7, 11, 14], suffix: 'maj9' },
  min9: { intervals: [0, 3, 7, 10, 14], suffix: 'm9' },
  add9: { intervals: [0, 4, 7, 14], suffix: 'add9' },
} as const;

export type ChordType = keyof typeof CHORD_PATTERNS;

export const CHORD_DISPLAY_NAMES: Record<ChordType, string> = {
  maj: 'Major',
  min: 'Minor',
  dim: 'Dim',
  aug: 'Aug',
  sus2: 'Sus2',
  sus4: 'Sus4',
  maj7: 'Maj7',
  min7: 'Min7',
  dom7: 'Dom7',
  maj9: 'Maj9',
  min9: 'Min9',
  add9: 'Add9',
};

export const CHORD_TYPES_ORDER: ChordType[] = [
  'maj', 'min', 'dim', 'aug', 'sus2', 'sus4',
  'maj7', 'min7', 'dom7', 'maj9', 'min9', 'add9',
];
