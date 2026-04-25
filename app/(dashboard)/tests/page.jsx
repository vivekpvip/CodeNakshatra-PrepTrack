'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useTests } from '@/hooks/useTests';
import { getAllTopics } from '@/lib/syllabus';
import TestEntryForm from '@/components/tests/TestEntryForm';
import TestHistoryTable from '@/components/tests/TestHistoryTable';
import AccuracyChart from '@/components/tests/AccuracyChart';
import WeakTopicsCard from '@/components/tests/WeakTopicsCard';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Plus, Target, TrendingUp, AlertTriangle } from 'lucide-react';

export default function TestsPage() {
  const { profile } = useUser();
  const { tests, loading, addTest, deleteTest, getAverageScore, getWeakTopics } = useTests();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    if (profile?.exam_type) {
      setTopics(getAllTopics(profile.exam_type));
    }
  }, [profile?.exam_type]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonCard height="300px" />
        <SkeletonCard height="400px" />
      </div>
    );
  }

  const avgScore = getAverageScore();
  const weakTopics = getWeakTopics();

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold mb-1">Test Analytics</h1>
          <p className="text-[var(--text-secondary)]">
            Track your mock scores and identify weak areas.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
          Log Mock Test
        </Button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent)] border border-[rgba(108,99,255,0.2)]">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Total Tests</p>
            <p className="text-2xl font-bold font-mono">{tests.length}</p>
          </div>
        </Card>
        
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--green-glow)] flex items-center justify-center text-[var(--green)] border border-[rgba(6,214,160,0.2)]">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Average Score</p>
            <p className="text-2xl font-bold font-mono">{avgScore}%</p>
          </div>
        </Card>
        
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--red-glow)] flex items-center justify-center text-[var(--red)] border border-[rgba(239,71,111,0.2)]">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Weak Topics</p>
            <p className="text-2xl font-bold font-mono">{weakTopics.length}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AccuracyChart tests={tests} />
        </div>
        <div>
          <WeakTopicsCard weakTopics={weakTopics} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4 mt-8">Test History</h3>
        <TestHistoryTable tests={tests} onDelete={deleteTest} />
      </div>

      <TestEntryForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={addTest}
        topics={topics}
      />
    </div>
  );
}
