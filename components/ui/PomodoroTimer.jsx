'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Play, Pause, RotateCcw, X, Coffee } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';
import toast from 'react-hot-toast';

const STUDY_MIN = 25;
const BREAK_MIN = 5;

export default function PomodoroTimer() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(STUDY_MIN * 60);
  const [mode, setMode] = useState('study'); // 'study' | 'break'
  const intervalRef = useRef(null);

  const total = (mode === 'study' ? STUDY_MIN : BREAK_MIN) * 60;
  const progress = 1 - seconds / total;
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;

  const logSession = async () => {
    if (!user) return;
    try {
      await supabase.from('study_sessions').insert({
        user_id: user.id,
        duration_min: STUDY_MIN,
      });
    } catch (err) {
      console.error('Failed to log study session:', err);
    }
  };

  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          if (mode === 'study') {
            logSession();
            toast.success("Study session done! Time for a 5-min break.");
            setMode('break');
            return BREAK_MIN * 60;
          }
          toast.success("Break over. Back to focus mode.");
          setMode('study');
          return STUDY_MIN * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, mode]);

  const reset = () => {
    setRunning(false);
    setSeconds((mode === 'study' ? STUDY_MIN : BREAK_MIN) * 60);
  };

  const switchMode = (next) => {
    setMode(next);
    setRunning(false);
    setSeconds((next === 'study' ? STUDY_MIN : BREAK_MIN) * 60);
  };

  const accentColor = mode === 'study' ? 'var(--accent)' : 'var(--teal)';

  return (
    <>
      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: running ? accentColor : 'var(--bg-card)',
          color: running ? 'white' : 'var(--text-secondary)',
          border: '1px solid var(--border-light)',
          boxShadow: running ? `0 0 24px ${accentColor}` : '0 4px 16px rgba(0,0,0,0.4)',
        }}
        aria-label="Toggle pomodoro timer"
      >
        {running ? (
          <span className="font-mono font-bold text-xs">
            {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
          </span>
        ) : (
          <Clock size={18} />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-20 right-5 z-40 w-72 glass-card p-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                {mode === 'study' ? <Clock size={14} /> : <Coffee size={14} />}
                {mode === 'study' ? 'Focus' : 'Break'}
              </h4>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-[rgba(255,255,255,0.05)]"
                aria-label="Close timer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex bg-[var(--bg-tertiary)] p-0.5 rounded-md text-xs mb-4">
              <button
                onClick={() => switchMode('study')}
                className={`flex-1 py-1 rounded ${mode === 'study' ? 'bg-[var(--bg-card)] text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}
              >
                25 min study
              </button>
              <button
                onClick={() => switchMode('break')}
                className={`flex-1 py-1 rounded ${mode === 'break' ? 'bg-[var(--bg-card)] text-[var(--teal)]' : 'text-[var(--text-muted)]'}`}
              >
                5 min break
              </button>
            </div>

            <div className="text-center my-4">
              <div
                className="font-mono font-bold text-5xl tabular-nums"
                style={{ color: accentColor }}
              >
                {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                <motion.div
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full"
                  style={{ background: accentColor }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setRunning((v) => !v)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-medium text-sm text-white"
                style={{ background: accentColor }}
              >
                {running ? <Pause size={14} /> : <Play size={14} />}
                {running ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={reset}
                className="px-3 py-2 rounded-md text-sm border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <RotateCcw size={14} />
              </button>
            </div>

            {mode === 'study' && (
              <p className="text-[10px] text-[var(--text-muted)] mt-3 text-center">
                Completed sessions auto-log to your study time.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
