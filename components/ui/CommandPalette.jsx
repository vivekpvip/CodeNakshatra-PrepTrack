'use client';

import { useEffect, useState, useMemo, createContext, useContext } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  CalendarCheck,
  FileText,
  BarChart3,
  Bot,
  BookOpen,
  Trophy,
  Settings,
  Search,
  Plus,
  LogOut,
} from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { getAllTopics } from '@/lib/syllabus';

const CommandPaletteContext = createContext({ open: () => {}, close: () => {} });

export function useCommandPalette() {
  return useContext(CommandPaletteContext);
}

export function CommandPaletteProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const { profile, signOut } = useUser();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const close = () => {
    setIsOpen(false);
    setSearch('');
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Syllabus', href: '/syllabus', icon: Map },
    { label: 'Planner', href: '/planner', icon: CalendarCheck },
    { label: 'Tests', href: '/tests', icon: FileText },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'AI Coach', href: '/coach', icon: Bot },
    { label: 'Resources', href: '/resources', icon: BookOpen },
    { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const actionItems = [
    { label: 'Add a test result', href: '/tests', icon: Plus },
    { label: 'Plan today', href: '/planner', icon: Plus },
    { label: 'Ask the AI Coach', href: '/coach', icon: Bot },
  ];

  const topics = useMemo(() => {
    if (!profile?.exam_type) return [];
    return getAllTopics(profile.exam_type).slice(0, 200);
  }, [profile?.exam_type]);

  const go = (href) => {
    close();
    router.push(href);
  };

  return (
    <CommandPaletteContext.Provider value={{ open: () => setIsOpen(true), close }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-start justify-center pt-[10vh] px-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
            onClick={close}
          >
            <motion.div
              initial={{ scale: 0.96, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: -10 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Command
                label="Command Palette"
                className="glass-card overflow-hidden"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}
              >
                <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
                  <Search size={16} className="text-[var(--text-muted)]" />
                  <Command.Input
                    value={search}
                    onValueChange={setSearch}
                    placeholder="Type a page, topic, or action…"
                    className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--text-muted)]"
                    autoFocus
                  />
                  <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] font-mono">
                    ESC
                  </kbd>
                </div>

                <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                  <Command.Empty className="px-3 py-6 text-center text-sm text-[var(--text-muted)]">
                    No results.
                  </Command.Empty>

                  <Command.Group heading="Pages" className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] px-2 py-1">
                    {navItems.map((item) => (
                      <Command.Item
                        key={item.href}
                        value={`page ${item.label}`}
                        onSelect={() => go(item.href)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm aria-selected:bg-[var(--accent-muted)] aria-selected:text-[var(--accent)]"
                      >
                        <item.icon size={16} />
                        {item.label}
                      </Command.Item>
                    ))}
                  </Command.Group>

                  <Command.Group heading="Quick Actions" className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] px-2 py-1 mt-2">
                    {actionItems.map((item) => (
                      <Command.Item
                        key={item.label}
                        value={`action ${item.label}`}
                        onSelect={() => go(item.href)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm aria-selected:bg-[var(--accent-muted)] aria-selected:text-[var(--accent)]"
                      >
                        <item.icon size={16} />
                        {item.label}
                      </Command.Item>
                    ))}
                  </Command.Group>

                  {topics.length > 0 && (
                    <Command.Group heading="Topics" className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] px-2 py-1 mt-2">
                      {topics.map((t) => (
                        <Command.Item
                          key={t.id}
                          value={`topic ${t.name} ${t.subjectName} ${t.paperName}`}
                          onSelect={() => go(`/syllabus?topic=${encodeURIComponent(t.id)}`)}
                          className="flex flex-col px-3 py-2 rounded-lg cursor-pointer text-sm aria-selected:bg-[var(--accent-muted)] aria-selected:text-[var(--accent)]"
                        >
                          <span>{t.name}</span>
                          <span className="text-[11px] text-[var(--text-muted)]">{t.subjectName}</span>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  )}

                  <Command.Group heading="Account" className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] px-2 py-1 mt-2">
                    <Command.Item
                      value="account sign out"
                      onSelect={async () => {
                        close();
                        await signOut();
                        router.push('/login');
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm aria-selected:bg-[var(--red-glow)] aria-selected:text-[var(--red)]"
                    >
                      <LogOut size={16} />
                      Sign out
                    </Command.Item>
                  </Command.Group>
                </Command.List>
              </Command>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </CommandPaletteContext.Provider>
  );
}
