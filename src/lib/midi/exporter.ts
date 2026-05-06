// midi-writer-js exposes default export as a namespace
import MidiWriter from 'midi-writer-js';
import { parseChordName } from '@/lib/theory/parser';
import { getChordNotes } from '@/lib/theory/chords';

export interface MidiProgressionInput {
  chords: string[];
}

export function generateProgressionMidi(
  progression: MidiProgressionInput,
  bpm: number,
  octave = 3,
): Buffer {
  const track = new MidiWriter.Track();
  track.setTempo(bpm);

  for (const chordStr of progression.chords) {
    const parsed = parseChordName(chordStr);
    if (!parsed) continue;
    const notes = getChordNotes(parsed.root, parsed.type);
    const midiNotes = notes.map((n) => `${n}${octave}`);
    track.addEvent(
      new MidiWriter.NoteEvent({
        pitch: midiNotes,
        duration: '2', // half note
        velocity: 80,
      }),
    );
  }

  const writer = new MidiWriter.Writer([track]);
  return Buffer.from(writer.buildFile());
}
