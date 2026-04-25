'use client';

import { useState, useMemo } from 'react';
import { useUser } from '@/hooks/useUser';
import { useSyllabus } from '@/hooks/useSyllabus';
import { getSyllabus, examTypes } from '@/lib/syllabus';
import SyllabusTree from '@/components/syllabus/SyllabusTree';
import Card from '@/components/ui/Card';
import { SkeletonCard } from '@/components/ui/Skeleton';
import ProgressBar from '@/components/ui/ProgressBar';
import { Search, Filter, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function SyllabusPage() {
  const { profile } = useUser();
  const { progress, loading, updateTopicStatus, updateTopicNotes } = useSyllabus();
  
  const [activeTab, setActiveTab] = useState(profile?.exam_type || 'upsc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, not_started, in_progress, revised

  const syllabus = useMemo(() => getSyllabus(activeTab), [activeTab]);

  // Compute completion stats for the header
  const stats = useMemo(() => {
    if (!syllabus || !progress) return { percent: 0, revised: 0, total: 0 };
    
    let total = 0;
    let revised = 0;
    
    syllabus.papers.forEach(p => {
      p.subjects.forEach(s => {
        s.topics.forEach(t => {
          total++;
          if (progress[t.id]?.status === 'revised') revised++;
        });
      });
    });
    
    return {
      total,
      revised,
      percent: total > 0 ? Math.round((revised / total) * 100) : 0
    };
  }, [syllabus, progress]);

  const handleStatusChange = async (topicId, newStatus) => {
    try {
      await updateTopicStatus(topicId, newStatus);
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const handleNotesSave = async (topicId, notes) => {
    try {
      await updateTopicNotes(topicId, notes);
      toast.success('Notes saved');
    } catch (error) {
      toast.error('Failed to save notes');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard height="100px" />
        <SkeletonCard height="400px" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Syllabus Tracker</h1>
          <p className="text-[var(--text-secondary)]">
            Master every topic. One row at a time.
          </p>
        </div>
      </div>

      {/* Top Header Card */}
      <Card className="flex flex-col md:flex-row items-center gap-6" padding={false}>
        <div className="w-full md:w-2/3 p-6 border-b md:border-b-0 md:border-r border-[var(--border)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="text-[var(--accent)]" />
              {syllabus.name} Overall Progress
            </h2>
            <span className="text-2xl font-bold font-mono text-[var(--accent)] text-glow-accent">
              {stats.percent}%
            </span>
          </div>
          <ProgressBar value={stats.percent} max={100} height={12} className="mb-2" />
          <p className="text-sm text-[var(--text-secondary)] text-right">
            {stats.revised} / {stats.total} topics mastered
          </p>
        </div>

        <div className="w-full md:w-1/3 p-6 flex flex-col justify-center">
          <label className="text-xs text-[var(--text-muted)] font-medium mb-2 uppercase tracking-wider">Viewing Exam</label>
          <div className="flex bg-[var(--bg-tertiary)] p-1 rounded-lg border border-[var(--border)] overflow-x-auto scrollbar-hide">
            {examTypes.map(exam => (
              <button
                key={exam.id}
                onClick={() => setActiveTab(exam.id)}
                className={cn(
                  'flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex items-center justify-center gap-2',
                  activeTab === exam.id 
                    ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm border border-[var(--border-light)]' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.02)]'
                )}
              >
                {exam.icon} <span className="hidden sm:inline">{exam.id.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
          <input
            type="text"
            placeholder="Search papers, subjects, or topics..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg p-1">
          {[
            { id: 'all', label: 'All', icon: Filter },
            { id: 'not_started', label: 'To Do', icon: Circle },
            { id: 'in_progress', label: 'Doing', icon: null },
            { id: 'revised', label: 'Done', icon: null },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                filter === f.id
                  ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tree View */}
      <SyllabusTree 
        syllabus={syllabus} 
        progress={progress} 
        onStatusChange={handleStatusChange}
        onNotesSave={handleNotesSave}
        searchTerm={searchTerm}
        // filter could be implemented inside SyllabusTree to hide non-matching items
      />
    </div>
  );
}
