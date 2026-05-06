'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GenreSelector } from './GenreSelector';
import { KeyScaleSelector } from './KeyScaleSelector';
import { Piano } from './Piano';
import { NotesDisplay } from './NotesDisplay';
import { ChordBuilder } from './ChordBuilder';
import { ProgressionList } from './ProgressionList';
import { ProgressionPlayer } from './ProgressionPlayer';

export default function Studio() {
  return (
    <div className="container space-y-6 py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr_280px]">
        <Card>
          <CardHeader>
            <CardTitle>Genre</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <GenreSelector />
            <KeyScaleSelector />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Piano &amp; Chord Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Piano />
            <NotesDisplay />
            <div className="pt-2">
              <CardTitle className="mb-2">Build a Chord</CardTitle>
              <ChordBuilder />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suggested Progressions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressionList />
            <CardTitle className="mt-2">Active Progression</CardTitle>
            <ProgressionPlayer />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
