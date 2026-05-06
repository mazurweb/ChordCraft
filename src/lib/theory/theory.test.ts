import { describe, it, expect } from 'vitest';
import { getScaleNotes } from './scales';
import { getChordNotes, buildChordName } from './chords';
import { parseChordName } from './parser';

describe('getScaleNotes', () => {
  it('C major', () => {
    expect(getScaleNotes('C', 'major')).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  });
  it('A minor', () => {
    expect(getScaleNotes('A', 'minor')).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
  });
  it('F# dorian', () => {
    expect(getScaleNotes('F#', 'dorian')).toEqual(['F#', 'G#', 'A', 'B', 'C#', 'D#', 'E']);
  });
});

describe('getChordNotes', () => {
  it('C major triad', () => {
    expect(getChordNotes('C', 'maj')).toEqual(['C', 'E', 'G']);
  });
  it('A minor 7', () => {
    expect(getChordNotes('A', 'min7')).toEqual(['A', 'C', 'E', 'G']);
  });
  it('G dominant 7', () => {
    expect(getChordNotes('G', 'dom7')).toEqual(['G', 'B', 'D', 'F']);
  });
});

describe('parseChordName', () => {
  it('parses Cmaj7', () => {
    expect(parseChordName('Cmaj7')).toEqual({ root: 'C', type: 'maj7' });
  });
  it('parses F#m', () => {
    expect(parseChordName('F#m')).toEqual({ root: 'F#', type: 'min' });
  });
  it('normalizes Bb to A#', () => {
    expect(parseChordName('Bb')).toEqual({ root: 'A#', type: 'maj' });
  });
  it('parses Am7', () => {
    expect(parseChordName('Am7')).toEqual({ root: 'A', type: 'min7' });
  });
  it('parses G7', () => {
    expect(parseChordName('G7')).toEqual({ root: 'G', type: 'dom7' });
  });
});

describe('buildChordName', () => {
  it('round-trips through parser for triads', () => {
    expect(parseChordName(buildChordName('D', 'min'))).toEqual({ root: 'D', type: 'min' });
    expect(parseChordName(buildChordName('C', 'maj'))).toEqual({ root: 'C', type: 'maj' });
  });
});
