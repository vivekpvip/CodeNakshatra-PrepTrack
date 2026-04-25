'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Trash2, GripVertical, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export default function DailyTargets({ 
  targets, 
  topics, 
  dateStr, 
  onToggle, 
  onDelete,
  isToday 
}) {
  const enrichedTargets = targets.map(t => ({
    ...t,
    topic: topics.find(tp => tp.id === t.topic_id)
  }));

  const completedCount = enrichedTargets.filter(t => t.completed).length;
  const totalCount = enrichedTargets.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allDone = totalCount > 0 && completedCount === totalCount;

  return (
    <Card className={cn("flex flex-col relative overflow-hidden", isToday && "border-[var(--accent)] glow-accent")}>
      {allDone && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--green)] opacity-[0.03] rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      )}
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            {isToday ? "Today's Focus" : "Planned Targets"}
            {allDone && <span className="text-xs bg-[var(--green-glow)] text-[var(--green)] px-2 py-0.5 rounded-full uppercase tracking-wide">Complete</span>}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold text-[var(--accent)] text-glow-accent">
            {percent}%
          </div>
          <p className="text-xs text-[var(--text-muted)]">{completedCount} of {totalCount} done</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 relative z-10">
        <AnimatePresence>
          {enrichedTargets.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="py-12 flex flex-col items-center text-center border border-dashed border-[var(--border)] rounded-xl bg-[rgba(255,255,255,0.01)]"
            >
              <AlertCircle className="text-[var(--text-muted)] mb-3" size={32} />
              <p className="text-[var(--text-secondary)] font-medium mb-1">No targets planned.</p>
              <p className="text-xs text-[var(--text-muted)] max-w-[200px]">
                Search for topics on the right to add them to your plan.
              </p>
            </motion.div>
          ) : (
            enrichedTargets.map((target, idx) => (
              <motion.div
                key={target.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'group flex items-center gap-3 p-4 rounded-xl border transition-all duration-300',
                  target.completed
                    ? 'bg-[var(--bg-tertiary)] border-[var(--border)] opacity-70'
                    : 'bg-[var(--bg-card)] border-[var(--border-light)] shadow-sm hover:border-[var(--accent)] hover:shadow-[0_0_15px_var(--accent-glow)]'
                )}
              >
                <div className="cursor-grab active:cursor-grabbing text-[var(--border)] hover:text-[var(--text-muted)] px-1 hidden sm:block">
                  <GripVertical size={16} />
                </div>
                
                <button 
                  onClick={() => onToggle(target.id)}
                  className="shrink-0 transition-transform active:scale-90"
                >
                  {target.completed ? (
                    <CheckCircle2 size={24} className="text-[var(--green)] drop-shadow-[0_0_8px_var(--green-glow)]" />
                  ) : (
                    <Circle size={24} className="text-[var(--text-muted)] hover:text-[var(--accent)]" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-base font-semibold truncate transition-colors duration-300',
                    target.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
                  )}>
                    {target.topic?.name || 'Unknown Topic'}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] truncate flex items-center gap-2 mt-0.5">
                    <span className="bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
                      {target.topic?.paperName}
                    </span>
                    {target.topic?.subjectName}
                  </p>
                </div>

                <button
                  onClick={() => onDelete(target.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-[var(--text-muted)] hover:text-[var(--red)] hover:bg-[var(--red-glow)] rounded-lg transition-all shrink-0"
                  aria-label="Delete target"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
