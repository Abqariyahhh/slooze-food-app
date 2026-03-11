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
    <aside className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col">
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
  );
}
