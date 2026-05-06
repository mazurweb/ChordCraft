import { describe, it, expect } from 'vitest';
import { generateProgressionMidi } from './exporter';

describe('generateProgressionMidi', () => {
  it('produces a non-empty MIDI buffer with the standard header', () => {
    const buf = generateProgressionMidi({ chords: ['Cmaj7', 'Am7', 'Dm7', 'G7'] }, 90);
    expect(buf.length).toBeGreaterThan(20);
    // SMF header chunk: "MThd"
    expect(buf.slice(0, 4).toString('ascii')).toBe('MThd');
  });
});
