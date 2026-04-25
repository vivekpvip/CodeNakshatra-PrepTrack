'use client';

import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/hooks/useUser';
import { usePlanner } from '@/hooks/usePlanner';
import { getAllTopics } from '@/lib/syllabus';
import WeekCalendar from '@/components/planner/WeekCalendar';
import DailyTargets from '@/components/planner/DailyTargets';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Search, Plus, Calendar as CalendarIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function PlannerPage() {
  const { profile } = useUser();
  const { targets, loading, addTarget, toggleTarget, deleteTarget } = usePlanner();
  
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [searchTerm, setSearchTerm] = useState('');
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    if (profile?.exam_type) {
      setTopics(getAllTopics(profile.exam_type));
    }
  }, [profile?.exam_type]);

  const searchResults = useMemo(() => {
    if (!searchTerm) return [];
    const q = searchTerm.toLowerCase();
    return topics
      .filter(t => t.name.toLowerCase().includes(q) || t.subjectName.toLowerCase().includes(q))
      .slice(0, 10); // Limit results
  }, [searchTerm, topics]);

  const handleAddTarget = async (topicId) => {
    try {
      // Check if already exists for this date
      if (targets.some(t => t.target_date === selectedDate && t.topic_id === topicId)) {
        toast.error('Topic already planned for this date');
        return;
      }
      
      await addTarget(topicId, selectedDate);
      toast.success('Added to planner');
      setSearchTerm('');
    } catch (err) {
      toast.error('Failed to add target');
    }
  };

  const selectedTargets = useMemo(() => {
    return targets.filter(t => t.target_date === selectedDate);
  }, [targets, selectedDate]);

  const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold mb-1">Study Planner</h1>
          <p className="text-[var(--text-secondary)]">
            Schedule your targets. Build your streak.
          </p>
        </div>
      </div>

      <WeekCalendar 
        targets={targets} 
        selectedDate={selectedDate} 
        onSelectDate={setSelectedDate} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Area - Targets List */}
        <div className="lg:col-span-2">
          <DailyTargets 
            targets={selectedTargets}
            topics={topics}
            dateStr={selectedDate}
            onToggle={toggleTarget}
            onDelete={deleteTarget}
            isToday={isToday}
          />
        </div>

        {/* Sidebar - Add Target & Reminders */}
        <div className="space-y-6">
          <Card className="flex flex-col">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Plus size={18} className="text-[var(--accent)]" />
              Add to {isToday ? 'Today' : format(new Date(selectedDate), 'MMM d')}
            </h3>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
              <input
                type="text"
                placeholder="Search topic to add..."
                className="input pl-10 bg-[var(--bg-secondary)]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto max-h-[300px] custom-scrollbar rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)]">
              {searchTerm && searchResults.length === 0 ? (
                <div className="p-4 text-center text-sm text-[var(--text-secondary)]">
                  No topics found matching "{searchTerm}"
                </div>
              ) : searchResults.length > 0 ? (
                <div className="divide-y divide-[var(--border)]">
                  {searchResults.map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => handleAddTarget(topic.id)}
                      className="w-full text-left p-3 hover:bg-[rgba(255,255,255,0.03)] transition-colors group"
                    >
                      <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                        {topic.name}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-1">
                        {topic.subjectName}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center flex flex-col items-center text-sm text-[var(--text-muted)]">
                  <CalendarIcon size={24} className="mb-2 opacity-50" />
                  Search for topics to build your schedule.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
