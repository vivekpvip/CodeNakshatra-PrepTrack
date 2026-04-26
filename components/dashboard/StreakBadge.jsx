'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export default function StreakBadge({ streak = 0, longest = 0, size = 'md' }) {
  const sizes = {
    sm: { wrap: 'px-2.5 py-1', icon: 12, num: 'text-sm' },
    md: { wrap: 'px-3 py-1.5', icon: 14, num: 'text-base' },
    lg: { wrap: 'px-4 py-2', icon: 18, num: 'text-xl' },
  };
  const s = sizes[size] || sizes.md;
  const isHot = streak >= 7;

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className={`inline-flex items-center gap-2 rounded-full ${s.wrap} font-mono font-bold`}
      style={{
        background: isHot ? 'var(--amber-glow)' : 'var(--bg-tertiary)',
        color: isHot ? 'var(--amber)' : 'var(--text-secondary)',
        border: `1px solid ${isHot ? 'var(--amber)' : 'var(--border)'}`,
        boxShadow: isHot ? '0 0 16px var(--amber-glow)' : 'none',
      }}
      title={`Longest: ${longest} days`}
    >
      <Flame size={s.icon} className={isHot ? 'animate-pulse' : ''} />
      <span className={s.num}>{streak}</span>
      <span className="text-[10px] uppercase tracking-wider opacity-70">
        day streak
      </span>
    </motion.div>
  );
}
