'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const DEMO_ACCOUNTS = [
  { role: 'ADMIN', email: 'admin@slooze.com', password: 'admin123', country: 'INDIA', color: 'bg-red-500' },
  { role: 'MANAGER', email: 'manager@slooze.com', password: 'manager123', country: 'AMERICA', color: 'bg-blue-500' },
  { role: 'MEMBER', email: 'member@slooze.com', password: 'member123', country: 'INDIA', color: 'bg-green-500' },
];

export function RoleSwitcher() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const switchRole = async (account: typeof DEMO_ACCOUNTS[0]) => {
    setLoading(account.role);
    try {
      const res = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation {
            login(input: { email: "${account.email}", password: "${account.password}" }) {
              accessToken email firstName role country userId
            }
          }`,
        }),
      });
      const { data } = await res.json();
      const auth = data?.login;
      if (!auth) throw new Error('Login failed');
      localStorage.setItem('token', auth.accessToken);
      localStorage.setItem('user', JSON.stringify({
        email: auth.email,
        firstName: auth.firstName,
        role: auth.role,
        country: auth.country,
        userId: auth.userId,
      }));
      toast.success(`Switched to ${account.role} 👤`);
      setOpen(false);
      router.refresh();
      window.location.href = '/dashboard';
    } catch {
      toast.error('Switch failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-2 bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl w-56">
          <p className="text-xs text-slate-400 font-medium mb-2 px-1">⚡ Quick Role Switch</p>
          <div className="space-y-1">
            {DEMO_ACCOUNTS.map(account => (
              <button
                key={account.role}
                onClick={() => switchRole(account)}
                disabled={loading === account.role}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors text-left"
              >
                <span className={`w-2 h-2 rounded-full ${account.color} shrink-0`} />
                <div>
                  <p className="text-white text-sm font-medium">{account.role}</p>
                  <p className="text-slate-500 text-xs">{account.country}</p>
                </div>
                {loading === account.role && (
                  <span className="ml-auto text-slate-400 text-xs animate-pulse">...</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-xl text-xs font-medium shadow-xl hover:bg-slate-700 transition-colors flex items-center gap-2"
      >
        <span>👤</span>
        Dev: Switch Role
        <span className="text-slate-400">{open ? '▼' : '▲'}</span>
      </button>
    </div>
  );
}
