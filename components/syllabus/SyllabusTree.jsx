'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Folder } from 'lucide-react';
import TopicRow from './TopicRow';

export default function SyllabusTree({ syllabus, progress, onStatusChange, onNotesSave, searchTerm = '' }) {
  if (!syllabus) return null;

  return (
    <div className="space-y-4">
      {syllabus.papers.map(paper => (
        <PaperAccordion 
          key={paper.id} 
          paper={paper} 
          progress={progress}
          onStatusChange={onStatusChange}
          onNotesSave={onNotesSave}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  );
}

function PaperAccordion({ paper, progress, onStatusChange, onNotesSave, searchTerm }) {
  const [isOpen, setIsOpen] = useState(true); // Open by default

  // Calculate paper completion
  const allTopics = paper.subjects.flatMap(s => s.topics);
  const totalTopics = allTopics.length;
  const completedTopics = allTopics.filter(t => progress[t.id]?.status === 'revised').length;
  const percentComplete = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Filter based on search term
  const filteredSubjects = paper.subjects.map(subject => ({
    ...subject,
    topics: subject.topics.filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(s => s.topics.length > 0);

  if (searchTerm && filteredSubjects.length === 0) return null;

  return (
    <div className="glass-card overflow-hidden border border-[var(--border)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-[var(--bg-tertiary)] hover:bg-[rgba(255,255,255,0.03)] transition-colors text-left border-b border-[var(--border)]"
      >
        <div className="flex items-center gap-3">
          {isOpen ? <ChevronDown size={20} className="text-[var(--text-muted)]" /> : <ChevronRight size={20} className="text-[var(--text-muted)]" />}
          <Folder size={18} className="text-[var(--accent)]" />
          <h2 className="text-lg font-bold text-[var(--text-primary)]">{paper.name}</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block w-32 h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--teal)] transition-all duration-500" 
              style={{ width: `${percentComplete}%` }}
            />
          </div>
          <span className="text-sm font-mono font-medium text-[var(--text-secondary)]">
            {percentComplete}%
          </span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="divide-y divide-[var(--border)] bg-[var(--bg-card)]">
              {(searchTerm ? filteredSubjects : paper.subjects).map((subject, idx) => (
                <SubjectSection 
                  key={subject.id} 
                  subject={subject} 
                  progress={progress}
                  onStatusChange={onStatusChange}
                  onNotesSave={onNotesSave}
                  isLast={idx === paper.subjects.length - 1}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SubjectSection({ subject, progress, onStatusChange, onNotesSave, isLast }) {
  // Calculate subject completion
  const totalTopics = subject.topics.length;
  const completedTopics = subject.topics.filter(t => progress[t.id]?.status === 'revised').length;
  const isSubjectComplete = totalTopics > 0 && completedTopics === totalTopics;

  return (
    <div className={`p-0 ${!isLast ? 'border-b border-[var(--border)]' : ''}`}>
      <div className="bg-[rgba(255,255,255,0.01)] py-2 px-4 pl-10 border-b border-[var(--border)] flex justify-between items-center">
        <h3 className={`text-sm font-semibold ${isSubjectComplete ? 'text-[var(--green)]' : 'text-[var(--text-secondary)]'}`}>
          {subject.name}
        </h3>
        <span className="text-xs text-[var(--text-muted)] font-mono">
          {completedTopics}/{totalTopics}
        </span>
      </div>
      <div>
        {subject.topics.map(topic => (
          <TopicRow
            key={topic.id}
            topic={topic}
            status={progress[topic.id]?.status || 'not_started'}
            notes={progress[topic.id]?.notes || ''}
            onStatusChange={onStatusChange}
            onNotesSave={onNotesSave}
          />
        ))}
      </div>
    </div>
  );
}
