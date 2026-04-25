'use client';

import { Search, Flame, Sparkles, Bell } from 'lucide-react';
import { getLevel } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

export default function Topbar({ profile }) {
  const level = getLevel(profile?.xp_points || 0);
  return (
    <header className="h-16 border-b border-[var(--border)] flex items-center justify-between px-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] cursor-pointer hover:bg-[rgba(255,255,255,0.03)] transition-colors" style={{ border: '1px solid var(--border)' }}>
          <Search size={16} />
          <span>Search...</span>
          <kbd className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] font-mono ml-8">⌘K</kbd>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="accent" icon={Sparkles}>{level.icon} {profile?.xp_points || 0} XP</Badge>
        <Badge variant="amber" icon={Flame}>{profile?.streak || 0} streak</Badge>
        <button className="relative p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors" aria-label="Notifications">
          <Bell size={18} className="text-[var(--text-secondary)]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--red)]" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-sm font-bold" style={{ border: '2px solid var(--border-light)' }}>
          {profile?.full_name?.[0] || 'U'}
        </div>
      </div>
    </header>
  );
}
