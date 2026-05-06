import dynamic from 'next/dynamic';

const Studio = dynamic(() => import('@/components/studio/Studio'), { ssr: false });

export const metadata = {
  title: 'ChordCraft Studio — Build chords, progressions, and melodies',
};

export default function StudioPage() {
  return <Studio />;
}
