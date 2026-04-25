'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Circle, Minus, FileText, ChevronDown, ChevronRight, Edit3, X } from 'lucide-react';
import { getStatusColor, getStatusLabel } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function TopicRow({ 
  topic, 
  status, 
  notes, 
  onStatusChange, 
  onNotesSave 
}) {
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [tempNotes, setTempNotes] = useState(notes || '');

  const cycleStatus = () => {
    let nextStatus = 'not_started';
    if (status === 'not_started') nextStatus = 'in_progress';
    else if (status === 'in_progress') nextStatus = 'revised';
    
    onStatusChange(topic.id, nextStatus);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'revised': return <Check size={14} className="text-white" />;
      case 'in_progress': return <Minus size={14} className="text-white" />;
      case 'not_started':
      default: return <Circle size={14} className="text-[var(--text-muted)]" />;
    }
  };

  const handleNotesSave = () => {
    onNotesSave(topic.id, tempNotes);
    setIsNotesOpen(false);
  };

  return (
    <div className="group relative">
      <div 
        className="flex items-center justify-between py-3 px-4 border-b border-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
      >
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={cycleStatus}
            className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm"
            style={{ 
              backgroundColor: status === 'not_started' ? 'transparent' : getStatusColor(status),
              border: status === 'not_started' ? '1px solid var(--border)' : 'none'
            }}
            aria-label={`Current status: ${getStatusLabel(status)}. Click to change.`}
          >
            {getStatusIcon()}
          </button>
          
          <span className={`text-sm font-medium truncate transition-colors ${
            status === 'revised' ? 'text-[var(--text-secondary)] line-through' : 'text-[var(--text-primary)]'
          }`}>
            {topic.name}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <span 
            className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full"
            style={{ 
              backgroundColor: `${getStatusColor(status)}20`,
              color: getStatusColor(status)
            }}
          >
            {getStatusLabel(status)}
          </span>
          <button
            onClick={() => setIsNotesOpen(!isNotesOpen)}
            className={`p-1.5 rounded-md transition-colors ${
              notes ? 'text-[var(--accent)] bg-[var(--accent-muted)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.05)]'
            }`}
            aria-label="Toggle notes"
          >
            <FileText size={16} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isNotesOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[var(--bg-tertiary)] border-b border-[var(--border)]"
          >
            <div className="p-4 pl-14 flex items-start gap-4">
              <div className="flex-1">
                <textarea
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  placeholder="Add your personal notes, resource links, or mnemonics here..."
                  className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--text-primary)] min-h-[100px] focus:border-[var(--accent)] outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Button size="sm" onClick={handleNotesSave} icon={Check}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => { setIsNotesOpen(false); setTempNotes(notes || ''); }}>Cancel</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
