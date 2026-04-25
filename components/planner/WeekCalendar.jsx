'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';

export default function WeekCalendar({ targets, selectedDate, onSelectDate }) {
  const weekDays = useMemo(() => {
    const today = new Date();
    // Start from 3 days ago to show a rolling week
    const start = addDays(today, -3);
    
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(start, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const dayTargets = targets.filter(t => t.target_date === dateStr);
      const completed = dayTargets.filter(t => t.completed).length;
      
      return {
        date,
        dateStr,
        dayName: format(date, 'EEE'),
        dayNum: format(date, 'd'),
        isToday: isSameDay(date, today),
        targets: dayTargets,
        completed,
        total: dayTargets.length,
        progress: dayTargets.length > 0 ? completed / dayTargets.length : 0,
      };
    });
  }, [targets]);

  return (
    <div className="flex justify-between gap-2 overflow-x-auto pb-4 scrollbar-hide">
      {weekDays.map((day, idx) => {
        const isSelected = selectedDate === day.dateStr;
        
        return (
          <button
            key={day.dateStr}
            onClick={() => onSelectDate(day.dateStr)}
            className={cn(
              'flex flex-col items-center min-w-[60px] md:min-w-[80px] p-2 md:p-3 rounded-2xl transition-all duration-300 border relative group',
              isSelected 
                ? 'bg-[var(--accent-muted)] border-[var(--accent)] shadow-[0_0_20px_var(--accent-glow)]' 
                : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--accent-muted)]',
              day.isToday && !isSelected && 'border-t-2 border-t-[var(--teal)]'
            )}
          >
            {isSelected && (
              <motion.div
                layoutId="activeDay"
                className="absolute inset-0 rounded-2xl border border-[var(--accent)]"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            
            <span className={cn(
              'text-xs font-medium mb-1',
              day.isToday ? 'text-[var(--teal)]' : 'text-[var(--text-secondary)]'
            )}>
              {day.isToday ? 'TODAY' : day.dayName.toUpperCase()}
            </span>
            
            <span className={cn(
              'text-xl md:text-2xl font-bold mb-3',
              isSelected ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'
            )}>
              {day.dayNum}
            </span>

            {/* Target dots indicator */}
            <div className="flex flex-wrap justify-center gap-1 w-full px-1 min-h-[12px]">
              {day.total > 0 ? (
                <div className="w-full h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-[var(--accent)] transition-all duration-500"
                    style={{ width: `${day.progress * 100}%` }}
                  />
                </div>
              ) : (
                <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
              )}
            </div>
            
            {day.total > 0 && (
              <span className="text-[10px] text-[var(--text-muted)] font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5">
                {day.completed}/{day.total}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
