import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* @ts-expect-error Async Server Component */}
      <Header />
      <main className="min-h-[calc(100vh-8rem)]">{children}</main>
      <Footer />
    </>
  );
}
