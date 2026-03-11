'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, clearAuth } from '@/lib/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const roleBadgeColor: Record<string, string> = {
  ADMIN: 'bg-red-500/20 text-red-400 border-red-500/30',
  MANAGER: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  MEMBER: 'bg-green-500/20 text-green-400 border-green-500/30',
};

export function Navbar() {
  const router = useRouter();
  // ✅ Start as null to match server render, populate after mount
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getAuth());
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <span className="text-xl">🍽️</span>
        <span className="font-bold text-white text-lg">Slooze Food</span>
      </div>
      <div className="flex items-center gap-3">
        {/* ✅ Only render after client mount to avoid hydration mismatch */}
        {user && (
          <>
            <Badge className={`${roleBadgeColor[user.role] || ''} border text-xs`}>
              {user.role}
            </Badge>
            <Badge variant="outline" className="text-slate-400 border-slate-600 text-xs">
              🌍 {user.country}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-orange-500 text-white text-sm">
                      {user.firstName?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="end">
                <DropdownMenuLabel className="text-slate-300">
                  <div className="font-medium text-white">{user.firstName}</div>
                  <div className="text-xs text-slate-400">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 cursor-pointer"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </header>
  );
}
