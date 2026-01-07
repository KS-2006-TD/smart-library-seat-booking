'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEditor = pathname.includes('/admin/library/') && pathname.includes('/floor/');

  return (
    <>
      {!isEditor && <Header />}
      <main className={cn('flex-grow', isEditor && 'h-full')}>{children}</main>
      {!isEditor && <Footer />}
      <Toaster />
    </>
  );
}
