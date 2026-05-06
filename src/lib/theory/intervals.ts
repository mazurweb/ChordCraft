import { INTERVAL_NAMES } from '@/lib/data/scale-patterns';

export function getIntervalName(semitones: number): string {
  return INTERVAL_NAMES[semitones % 12] ?? '';
}
