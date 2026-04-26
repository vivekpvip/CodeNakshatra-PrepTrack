'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Button from './Button';
import { celebrate } from '@/lib/xp';

export default function LevelUpModal({ open, onClose, level }) {
  useEffect(() => {
    if (open) celebrate({ duration: 2400 });
  }, [open]);

  return (
    <AnimatePresence>
      {open && level && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full glass-card text-center p-10 overflow-hidden"
            style={{ borderColor: level.color }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: `radial-gradient(circle at center, ${level.color} 0%, transparent 70%)`,
              }}
            />
            <div className="relative">
              <div className="text-7xl mb-2">{level.icon}</div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)] mb-1">
                Level Up
              </p>
              <h2 className="text-3xl font-bold mb-2" style={{ color: level.color }}>
                {level.name}
              </h2>
              <p className="text-[var(--text-secondary)] mb-6">
                You've reached Level {level.level}.{' '}
                {level.nextAt
                  ? `Next: ${level.nextAt} XP.`
                  : 'You are at the top tier — keep going.'}
              </p>
              <Button onClick={onClose} icon={Sparkles}>
                Keep going
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
