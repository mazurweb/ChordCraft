export interface SynthPreset {
  id: string;
  name: string;
  oscillator: { type: 'triangle' | 'sine' | 'sawtooth' | 'square' };
  envelope: { attack: number; decay: number; sustain: number; release: number };
}

export const SYNTH_PRESETS: SynthPreset[] = [
  {
    id: 'soft',
    name: 'Soft Triangle',
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.05, decay: 0.2, sustain: 0.5, release: 1.5 },
  },
  {
    id: 'pluck',
    name: 'Pluck',
    oscillator: { type: 'sine' },
    envelope: { attack: 0.005, decay: 0.1, sustain: 0.2, release: 0.5 },
  },
  {
    id: 'pad',
    name: 'Warm Pad',
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 0.4, decay: 0.3, sustain: 0.7, release: 2.0 },
  },
];
