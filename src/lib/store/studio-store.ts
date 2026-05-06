'use client';

import { create } from 'zustand';
import type { Note, ScaleName } from '@/lib/data/scale-patterns';
import type { ChordType } from '@/lib/data/chord-patterns';
import type { Progression } from '@/lib/data/genres';

interface StudioState {
  genre: string;
  key: Note;
  scale: ScaleName;
  chordRoot: Note | null;
  chordType: ChordType;
  activeProgression: Progression | null;
  bpm: number;
  isPlaying: boolean;
  currentChordIndex: number;

  setGenre: (genre: string) => void;
  setKey: (key: Note) => void;
  setScale: (scale: ScaleName) => void;
  setChordRoot: (note: Note | null) => void;
  setChordType: (type: ChordType) => void;
  loadProgression: (prog: Progression | null) => void;
  setBpm: (bpm: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentChordIndex: (idx: number) => void;
  applyGenrePreset: (genreId: string, key: Note, scale: ScaleName, bpm: number) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  genre: 'phonk',
  key: 'D',
  scale: 'minor',
  chordRoot: null,
  chordType: 'maj',
  activeProgression: null,
  bpm: 90,
  isPlaying: false,
  currentChordIndex: 0,

  setGenre: (genre) => set({ genre }),
  setKey: (key) => set({ key }),
  setScale: (scale) => set({ scale }),
  setChordRoot: (chordRoot) => set({ chordRoot }),
  setChordType: (chordType) => set({ chordType }),
  loadProgression: (activeProgression) => set({ activeProgression, currentChordIndex: 0 }),
  setBpm: (bpm) => set({ bpm }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentChordIndex: (currentChordIndex) => set({ currentChordIndex }),
  applyGenrePreset: (genre, key, scale, bpm) =>
    set({ genre, key, scale, bpm, activeProgression: null, currentChordIndex: 0, isPlaying: false }),
}));
