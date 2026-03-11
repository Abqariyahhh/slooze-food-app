'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger if typing in input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      switch (e.key.toLowerCase()) {
        case 'r':
          router.push('/restaurants');
          toast('🍴 Restaurants', { duration: 1000 });
          break;
        case 'o':
          router.push('/orders');
          toast('📦 Orders', { duration: 1000 });
          break;
        case 'd':
          router.push('/dashboard');
          toast('📊 Dashboard', { duration: 1000 });
          break;
        case '?':
          toast(
            '⌨️ Shortcuts: D = Dashboard · R = Restaurants · O = Orders',
            { duration: 3000 }
          );
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [router]);

  return null;
}
