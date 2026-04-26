'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import Card from '@/components/ui/Card';

export default function CountdownClock({ targetDate, examName = 'Your Exam' }) {
  const [parts, setParts] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!targetDate) return;

    const tick = () => {
      const target = new Date(targetDate).getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);

      setParts({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!targetDate) {
    return (
      <Card className="text-center">
        <Calendar className="mx-auto text-[var(--text-muted)] mb-2" size={28} />
        <p className="text-sm text-[var(--text-secondary)]">No exam date set.</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">Add one in Settings.</p>
      </Card>
    );
  }

  const segments = [
    { label: 'Days', value: parts.days },
    { label: 'Hrs', value: parts.hours },
    { label: 'Min', value: parts.minutes },
    { label: 'Sec', value: parts.seconds },
  ];

  return (
    <Card hover={false}>
      <div className="flex items-center gap-2 mb-3 text-[var(--text-secondary)]">
        <Clock size={14} />
        <span className="text-xs uppercase tracking-wider font-semibold">
          Countdown to {examName}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {segments.map((s) => (
          <div key={s.label} className="text-center">
            <motion.div
              key={s.value}
              initial={{ y: -6, opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="font-mono font-bold text-3xl text-[var(--accent)] text-glow-accent"
            >
              {String(s.value).padStart(2, '0')}
            </motion.div>
            <div className="text-[10px] uppercase text-[var(--text-muted)] tracking-wider mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
