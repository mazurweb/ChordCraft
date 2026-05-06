import type { Note, ScaleName } from './scale-patterns';

export interface Progression {
  name: string;
  chords: string[];
  roman: string[];
}

export interface Genre {
  id: string;
  name: string;
  keys: string[];
  bpm: number;
  scale: ScaleName;
  defaultKey: Note;
  mood: string;
  scales: ScaleName[];
  progressions: Progression[];
}

export const GENRES: Record<string, Genre> = {
  phonk: {
    id: 'phonk',
    name: 'Phonk',
    keys: ['Dm', 'F#m', 'Gm', 'Am', 'Bm'],
    bpm: 90,
    scale: 'minor',
    defaultKey: 'D',
    mood: 'Dark, gritty, hypnotic',
    scales: ['minor', 'phrygian'],
    progressions: [
      { name: 'Classic Phonk', chords: ['Dm', 'Bb', 'F', 'C'], roman: ['i', 'VI', 'III', 'VII'] },
      { name: 'Memphis Mood', chords: ['Dm', 'Gm', 'C', 'F'], roman: ['i', 'iv', 'VII', 'III'] },
      { name: 'Dark Loop', chords: ['Dm', 'A', 'Dm', 'Gm'], roman: ['i', 'V', 'i', 'iv'] },
    ],
  },
  drift_phonk: {
    id: 'drift_phonk',
    name: 'Drift Phonk',
    keys: ['F#m', 'Gm', 'Am', 'Bm', 'C#m'],
    bpm: 150,
    scale: 'minor',
    defaultKey: 'F#',
    mood: 'Aggressive, fast, chaotic',
    scales: ['minor', 'phrygian', 'harmonic_minor'],
    progressions: [
      { name: 'Drift Anthem', chords: ['F#m', 'E', 'D', 'C#'], roman: ['i', 'VII', 'VI', 'V'] },
      { name: 'Aggressive', chords: ['F#m', 'D', 'B', 'C#'], roman: ['i', 'VI', 'iv', 'V'] },
      { name: 'Tunnel Vision', chords: ['F#m', 'C#m', 'D', 'E'], roman: ['i', 'v', 'VI', 'VII'] },
    ],
  },
  trap: {
    id: 'trap',
    name: 'Trap',
    keys: ['Cm', 'Dm', 'Em', 'F#m', 'Gm'],
    bpm: 140,
    scale: 'minor',
    defaultKey: 'C',
    mood: 'Hard, melodic, modern',
    scales: ['minor', 'harmonic_minor', 'phrygian'],
    progressions: [
      { name: 'Trap Standard', chords: ['Cm', 'Ab', 'Eb', 'Bb'], roman: ['i', 'VI', 'III', 'VII'] },
      { name: 'Drill Vibe', chords: ['Cm', 'Gm', 'Ab', 'Bb'], roman: ['i', 'v', 'VI', 'VII'] },
      { name: 'Emotional', chords: ['Cm', 'Eb', 'Ab', 'G'], roman: ['i', 'III', 'VI', 'V'] },
    ],
  },
  lofi: {
    id: 'lofi',
    name: 'Lo-fi',
    keys: ['Cmaj', 'Fmaj', 'Gmaj', 'Am', 'Em'],
    bpm: 75,
    scale: 'major',
    defaultKey: 'C',
    mood: 'Relaxed, jazzy, nostalgic',
    scales: ['major', 'dorian', 'mixolydian'],
    progressions: [
      { name: 'Jazz Lo-fi', chords: ['Cmaj7', 'Am7', 'Dm7', 'G7'], roman: ['Imaj7', 'vi7', 'ii7', 'V7'] },
      { name: 'Chill Vibes', chords: ['Fmaj7', 'Em7', 'Dm7', 'Cmaj7'], roman: ['IVmaj7', 'iii7', 'ii7', 'Imaj7'] },
      { name: 'Sleepy', chords: ['Cmaj7', 'Em7', 'Am7', 'Fmaj7'], roman: ['Imaj7', 'iii7', 'vi7', 'IVmaj7'] },
    ],
  },
  house: {
    id: 'house',
    name: 'House',
    keys: ['Am', 'Cmaj', 'Dm', 'Em', 'Gmaj'],
    bpm: 124,
    scale: 'minor',
    defaultKey: 'A',
    mood: 'Groovy, uplifting, danceable',
    scales: ['minor', 'major', 'dorian'],
    progressions: [
      { name: 'House Classic', chords: ['Am', 'F', 'C', 'G'], roman: ['vi', 'IV', 'I', 'V'] },
      { name: 'Deep House', chords: ['Am7', 'Dm7', 'Em7', 'Am7'], roman: ['i7', 'iv7', 'v7', 'i7'] },
      { name: 'Tech House', chords: ['Am', 'Em', 'F', 'C'], roman: ['vi', 'iii', 'IV', 'I'] },
    ],
  },
  rnb: {
    id: 'rnb',
    name: 'R&B',
    keys: ['Cmaj', 'Dm', 'Fmaj', 'Am', 'Em'],
    bpm: 75,
    scale: 'major',
    defaultKey: 'C',
    mood: 'Smooth, soulful, romantic',
    scales: ['major', 'minor', 'dorian'],
    progressions: [
      { name: 'Smooth R&B', chords: ['Cmaj7', 'Em7', 'Am7', 'Fmaj7'], roman: ['Imaj7', 'iii7', 'vi7', 'IVmaj7'] },
      { name: 'Neo-Soul', chords: ['Cmaj9', 'Fmaj9', 'Em9', 'Dm9'], roman: ['Imaj9', 'IVmaj9', 'iii9', 'ii9'] },
      { name: 'Sensual', chords: ['Am7', 'Dm7', 'Gmaj7', 'Cmaj7'], roman: ['vi7', 'ii7', 'V7', 'Imaj7'] },
    ],
  },
  pop: {
    id: 'pop',
    name: 'Pop',
    keys: ['Cmaj', 'Gmaj', 'Dmaj', 'Am', 'Em'],
    bpm: 110,
    scale: 'major',
    defaultKey: 'C',
    mood: 'Catchy, uplifting, accessible',
    scales: ['major', 'minor'],
    progressions: [
      { name: 'Pop Standard', chords: ['C', 'G', 'Am', 'F'], roman: ['I', 'V', 'vi', 'IV'] },
      { name: 'Sad Pop', chords: ['Am', 'F', 'C', 'G'], roman: ['vi', 'IV', 'I', 'V'] },
      { name: 'Anthem', chords: ['C', 'F', 'G', 'C'], roman: ['I', 'IV', 'V', 'I'] },
    ],
  },
  rock: {
    id: 'rock',
    name: 'Rock',
    keys: ['Em', 'Am', 'Dm', 'Gmaj', 'Amaj'],
    bpm: 120,
    scale: 'minor',
    defaultKey: 'E',
    mood: 'Powerful, driving, raw',
    scales: ['minor', 'major', 'mixolydian'],
    progressions: [
      { name: 'Rock Anthem', chords: ['Em', 'C', 'G', 'D'], roman: ['i', 'VI', 'III', 'VII'] },
      { name: 'Power', chords: ['Em', 'Am', 'D', 'G'], roman: ['i', 'iv', 'VII', 'III'] },
      { name: 'Rebel', chords: ['Em', 'D', 'C', 'B'], roman: ['i', 'VII', 'VI', 'V'] },
    ],
  },
  drill: {
    id: 'drill',
    name: 'Drill',
    keys: ['F#m', 'Gm', 'Am', 'Bm', 'C#m'],
    bpm: 142,
    scale: 'minor',
    defaultKey: 'F#',
    mood: 'Dark, menacing, raw',
    scales: ['minor', 'phrygian', 'harmonic_minor'],
    progressions: [
      { name: 'UK Drill', chords: ['F#m', 'D', 'A', 'C#'], roman: ['i', 'VI', 'III', 'V'] },
      { name: 'Brooklyn', chords: ['F#m', 'C#m', 'D', 'A'], roman: ['i', 'v', 'VI', 'III'] },
      { name: 'Sample Drill', chords: ['F#m', 'E', 'D', 'C#m'], roman: ['i', 'VII', 'VI', 'v'] },
    ],
  },
  jazz: {
    id: 'jazz',
    name: 'Jazz',
    keys: ['Cmaj', 'Fmaj', 'Bbmaj', 'Dm', 'Gm'],
    bpm: 120,
    scale: 'major',
    defaultKey: 'C',
    mood: 'Sophisticated, complex, expressive',
    scales: ['major', 'dorian', 'mixolydian', 'melodic_minor'],
    progressions: [
      { name: 'ii-V-I', chords: ['Dm7', 'G7', 'Cmaj7', 'Cmaj7'], roman: ['ii7', 'V7', 'Imaj7', 'Imaj7'] },
      { name: 'Bird Blues', chords: ['Cmaj7', 'F7', 'Em7', 'A7'], roman: ['Imaj7', 'IV7', 'iii7', 'VI7'] },
      { name: 'Modal', chords: ['Cmaj9', 'Dm9', 'Em9', 'Fmaj9'], roman: ['Imaj9', 'ii9', 'iii9', 'IVmaj9'] },
    ],
  },
  ambient: {
    id: 'ambient',
    name: 'Ambient',
    keys: ['Cmaj', 'Dmaj', 'Em', 'Am', 'Gmaj'],
    bpm: 80,
    scale: 'major',
    defaultKey: 'C',
    mood: 'Atmospheric, ethereal, peaceful',
    scales: ['major', 'lydian', 'dorian'],
    progressions: [
      { name: 'Floating', chords: ['Cmaj7', 'Fmaj7', 'Cmaj7', 'Fmaj7'], roman: ['Imaj7', 'IVmaj7', 'Imaj7', 'IVmaj7'] },
      { name: 'Suspended', chords: ['Csus2', 'Fsus2', 'Gsus2', 'Csus2'], roman: ['Isus', 'IVsus', 'Vsus', 'Isus'] },
      { name: 'Drone', chords: ['Cmaj9', 'Cmaj9', 'Fmaj9', 'Cmaj9'], roman: ['Imaj9', 'Imaj9', 'IVmaj9', 'Imaj9'] },
    ],
  },
  techno: {
    id: 'techno',
    name: 'Techno',
    keys: ['Am', 'Cm', 'Dm', 'Em', 'F#m'],
    bpm: 130,
    scale: 'minor',
    defaultKey: 'A',
    mood: 'Hypnotic, driving, mechanical',
    scales: ['minor', 'phrygian'],
    progressions: [
      { name: 'Detroit', chords: ['Am', 'Dm', 'Em', 'Am'], roman: ['i', 'iv', 'v', 'i'] },
      { name: 'Berlin Hard', chords: ['Am', 'F', 'Dm', 'Em'], roman: ['i', 'VI', 'iv', 'v'] },
      { name: 'Minimal', chords: ['Am', 'Am', 'Em', 'Em'], roman: ['i', 'i', 'v', 'v'] },
    ],
  },
};

export const GENRE_IDS = Object.keys(GENRES);
