'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Map, CalendarCheck, FileText, BarChart3, Bot, BookOpen, Trophy, Settings, LogOut, ChevronLeft, ChevronRight, Flame, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/syllabus', label: 'Syllabus', icon: Map },
  { href: '/planner', label: 'Planner', icon: CalendarCheck },
  { href: '/tests', label: 'Tests', icon: FileText },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/coach', label: 'AI Coach', icon: Bot },
  { href: '/resources', label: 'Resources', icon: BookOpen },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ user, onSignOut }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const NavItem = ({ item }) => {
    const isActive = pathname === item.href;
    return (
      <Link href={item.href}
        className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative',
          isActive ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.03)]'
        )}>
        {isActive && <motion.div layoutId="sidebarActive" className="absolute inset-0 rounded-lg" style={{ background: 'var(--accent-muted)', borderLeft: '3px solid var(--accent)' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
        <item.icon size={20} className="relative z-10 shrink-0" />
        {!collapsed && <span className="relative z-10 whitespace-nowrap">{item.label}</span>}
        {item.label === 'AI Coach' && !collapsed && <span className="relative z-10 ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--teal-glow)] text-[var(--teal)] font-mono">AI</span>}
      </Link>
    );
  };

  const content = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 h-16 border-b border-[var(--border)]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center font-bold text-white text-sm shrink-0" style={{ boxShadow: '0 0 20px var(--accent-glow)' }}>P</div>
          {!collapsed && <span className="text-lg font-bold">Prep<span className="text-[var(--accent)]">Track</span></span>}
        </Link>
        <button className="hidden md:flex p-1 rounded-md hover:bg-[rgba(255,255,255,0.05)]" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <button className="md:hidden p-1" onClick={() => setMobileOpen(false)} aria-label="Close"><X size={18} /></button>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map(item => <NavItem key={item.href} item={item} />)}
      </nav>
      <div className="px-3 py-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-sm font-bold shrink-0" style={{ border: '2px solid var(--border-light)' }}>
            {user?.full_name?.[0] || 'U'}
          </div>
          {!collapsed && <div className="min-w-0"><p className="text-sm font-medium truncate">{user?.full_name || 'Student'}</p><p className="text-xs text-[var(--text-muted)] flex items-center gap-1"><Flame size={10} className="text-[var(--amber)]" />{user?.streak || 0} day streak</p></div>}
        </div>
        {!collapsed && <button onClick={onSignOut} className="flex items-center gap-2 w-full px-3 py-2 mt-1 text-sm text-[var(--text-muted)] hover:text-[var(--red)] rounded-lg hover:bg-[rgba(239,71,111,0.08)] transition-all"><LogOut size={16} />Sign out</button>}
      </div>
    </div>
  );

  return (
    <>
      <motion.aside animate={{ width: collapsed ? 64 : 240 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-30 border-r border-[var(--border)]" style={{ backgroundColor: 'var(--bg-secondary)' }}>{content}</motion.aside>
      <button className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }} onClick={() => setMobileOpen(true)} aria-label="Open menu"><LayoutDashboard size={20} /></button>
      <AnimatePresence>
        {mobileOpen && (<><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setMobileOpen(false)} /><motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="fixed left-0 top-0 bottom-0 w-[240px] z-50 border-r border-[var(--border)] md:hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>{content}</motion.aside></>)}
      </AnimatePresence>
    </>
  );
}
