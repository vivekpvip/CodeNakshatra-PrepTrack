'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import TopicRow from './TopicRow';

export default function SubjectAccordion({
  subject,
  progress,
  onStatusChange,
  onNotesSave,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);

  const total = subject.topics.length;
  const revised = subject.topics.filter((t) => progress[t.id]?.status === 'revised').length;
  const inProg = subject.topics.filter((t) => progress[t.id]?.status === 'in_progress').length;
  const pct = total > 0 ? Math.round((revised / total) * 100) : 0;
  const isComplete = total > 0 && revised === total;

  return (
    <div className="border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--bg-card)]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[rgba(255,255,255,0.02)] transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          {open ? (
            <ChevronDown size={16} className="text-[var(--text-muted)] shrink-0" />
          ) : (
            <ChevronRight size={16} className="text-[var(--text-muted)] shrink-0" />
          )}
          <BookOpen size={14} className={isComplete ? 'text-[var(--green)]' : 'text-[var(--accent)]'} />
          <span className={`text-sm font-semibold truncate ${isComplete ? 'text-[var(--green)]' : 'text-[var(--text-primary)]'}`}>
            {subject.name}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {inProg > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--amber-glow)] text-[var(--amber)]">
              {inProg} in progress
            </span>
          )}
          <div className="hidden sm:block w-20 h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg, var(--accent), var(--teal))',
              }}
            />
          </div>
          <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
            {revised}/{total}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-[var(--border)]"
          >
            {subject.topics.map((topic) => (
              <TopicRow
                key={topic.id}
                topic={topic}
                status={progress[topic.id]?.status || 'not_started'}
                notes={progress[topic.id]?.notes || ''}
                onStatusChange={onStatusChange}
                onNotesSave={onNotesSave}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
