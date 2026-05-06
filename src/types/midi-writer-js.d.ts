// midi-writer-js ships types but its package.json exports map blocks bundler resolution.
// Re-declare a thin module that mirrors the API we use.
declare module 'midi-writer-js' {
  export class Track {
    setTempo(bpm: number): void;
    addEvent(event: NoteEvent | NoteEvent[]): void;
  }
  export class NoteEvent {
    constructor(opts: { pitch: string | string[]; duration: string; velocity?: number });
  }
  export class Writer {
    constructor(tracks: Track[]);
    buildFile(): Uint8Array;
  }
  const _default: { Track: typeof Track; NoteEvent: typeof NoteEvent; Writer: typeof Writer };
  export default _default;
}
