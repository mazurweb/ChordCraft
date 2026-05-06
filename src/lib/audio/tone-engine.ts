'use client';

import * as Tone from 'tone';

class ToneEngine {
  private synth: Tone.Synth | null = null;
  private chordSynth: Tone.PolySynth | null = null;
  private initialized = false;
  private starting: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.initialized) return;
    if (typeof window === 'undefined') return;
    if (this.starting) return this.starting;

    this.starting = (async () => {
      await Tone.start();

      this.synth = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 },
      }).toDestination();

      this.chordSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.05, decay: 0.2, sustain: 0.5, release: 1.5 },
      }).toDestination();
      this.chordSynth.volume.value = -8;

      this.initialized = true;
    })();
    return this.starting;
  }

  async playNote(note: string, octave = 4, duration = 0.3): Promise<void> {
    await this.init();
    this.synth?.triggerAttackRelease(`${note}${octave}`, duration);
  }

  async playChord(notes: string[], octave = 3, duration = 1): Promise<void> {
    await this.init();
    const noteNames = notes.map((n) => `${n}${octave}`);
    this.chordSynth?.triggerAttackRelease(noteNames, duration);
  }

  setBpm(bpm: number): void {
    if (typeof window === 'undefined') return;
    Tone.Transport.bpm.value = bpm;
  }

  dispose(): void {
    this.synth?.dispose();
    this.chordSynth?.dispose();
    this.synth = null;
    this.chordSynth = null;
    this.initialized = false;
    this.starting = null;
  }
}

export const toneEngine = new ToneEngine();
