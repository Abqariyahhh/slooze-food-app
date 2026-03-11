'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getAuth());
  }, []);

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['ADMIN', 'MANAGER', 'MEMBER'] },
    { href: '/restaurants', label: 'Restaurants', icon: '🍴', roles: ['ADMIN', 'MANAGER', 'MEMBER'] },
    { href: '/orders', label: 'My Orders', icon: '📦', roles: ['ADMIN', 'MANAGER', 'MEMBER'] },
    { href: '/payments', label: 'Payments', icon: '💳', roles: ['ADMIN'] },
  ];

  const visible = links.filter(l => l.roles.includes(user?.role || ''));
  const isOnDashboard = pathname === '/dashboard';

  return (
    <>
      {/* Desktop Sidebar — hidden on mobile */}
      <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-700 flex-col">
        {!isOnDashboard && (
          <div className="px-4 pt-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors group w-full"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
              Back to Dashboard
            </button>
            <div className="border-t border-slate-700/50 mt-3" />
          </div>
        )}
        <nav className="flex-1 p-4 space-y-1 mt-2">
          {visible.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                pathname === link.href
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">Slooze Food v1.0</p>
        </div>
      </aside>

      {/* Mobile Bottom Nav — visible only on mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 flex justify-around items-center px-2 py-2 z-50">
        {visible.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all',
              pathname === link.href
                ? 'text-orange-500'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <span className="text-xl">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
