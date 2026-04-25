'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useSyllabus } from '@/hooks/useSyllabus';
import { useTests } from '@/hooks/useTests';
import { usePlanner } from '@/hooks/usePlanner';
import { useStreak } from '@/hooks/useStreak';
import { getAllTopics } from '@/lib/syllabus';
import StatsRow from '@/components/dashboard/StatsRow';
import ActivityHeatmap from '@/components/dashboard/ActivityHeatmap';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { SkeletonCard, SkeletonText } from '@/components/ui/Skeleton';
import { CheckCircle2, Circle, ArrowRight, Lightbulb, Beaker } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { profile } = useUser();
  const { progress, getCompletionStats, loading: syllabusLoading } = useSyllabus();
  const { tests, getAverageScore, loading: testsLoading } = useTests();
  const { getTodayTargets, toggleTarget, loading: plannerLoading } = usePlanner();
  useStreak(); // just to initialize the hook and update profile

  const [topics, setTopics] = useState([]);
  const [todayTargets, setTodayTargets] = useState([]);
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    if (profile?.exam_type) {
      setTopics(getAllTopics(profile.exam_type));
    }
  }, [profile?.exam_type]);

  useEffect(() => {
    if (topics.length > 0 && !syllabusLoading) {
      setStats(getCompletionStats(topics));
    }
  }, [topics, progress, syllabusLoading, getCompletionStats]);

  useEffect(() => {
    if (!plannerLoading) {
      const targets = getTodayTargets();
      
      // Map targets to full topic data
      if (topics.length > 0) {
        const enriched = targets.map(t => {
          const topicData = topics.find(tp => tp.id === t.topic_id);
          return { ...t, topic: topicData };
        }).filter(t => t.topic);
        setTodayTargets(enriched);
      }
    }
  }, [plannerLoading, getTodayTargets, topics]);

  const handleToggleTarget = async (id) => {
    try {
      await toggleTarget(id);
    } catch (err) {
      toast.error('Failed to update target');
    }
  };

  const isLoading = syllabusLoading || testsLoading || plannerLoading || !stats;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Aspirant'}
          </h1>
          <p className="text-[var(--text-secondary)]">
            Here's your command center overview for today.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/planner">
            <Button variant="secondary" icon={Calendar}>Plan Day</Button>
          </Link>
          <Link href="/tests">
            <Button icon={Beaker}>Log Test</Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><SkeletonCard /></div>
            <div><SkeletonCard /></div>
          </div>
        </div>
      ) : (
        <>
          <StatsRow 
            profile={profile} 
            completionStats={stats} 
            testStats={{ average: getAverageScore(), count: tests.length }} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (2/3 width on LG) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Activity Heatmap */}
              <ActivityHeatmap />

              {/* AI Quick Insight */}
              <Card className="relative overflow-hidden border border-[var(--accent-glow)] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-tertiary)]">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-[var(--accent)]">
                  <Lightbulb size={120} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center">
                      <span className="text-white text-xs font-bold font-mono">AI</span>
                    </div>
                    <h3 className="font-semibold text-lg text-[var(--accent)] text-glow-accent">Coach Insight</h3>
                  </div>
                  <p className="text-[var(--text-primary)] leading-relaxed mb-4 max-w-2xl">
                    You've maintained a great {profile?.streak || 0}-day streak! However, your last two mock tests show a dip in accuracy in Modern History. I recommend focusing your next 2 study sessions exclusively on revising the freedom struggle phase.
                  </p>
                  <Link href="/coach">
                    <Button variant="ghost" size="sm" icon={ArrowRight} className="text-[var(--accent)] hover:bg-[var(--accent-muted)]">
                      Ask Coach for a plan
                    </Button>
                  </Link>
                </div>
              </Card>

            </div>

            {/* Right Column (1/3 width on LG) */}
            <div className="space-y-6">
              
              {/* Today's Targets */}
              <Card className="flex flex-col h-[calc(100%-24px)] min-h-[400px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold">Today's Targets</h3>
                  <span className="text-xs bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-2 py-1 rounded font-mono">
                    {todayTargets.filter(t => t.completed).length}/{todayTargets.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  {todayTargets.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-[rgba(255,255,255,0.02)] rounded-lg border border-dashed border-[var(--border)]">
                      <Calendar className="text-[var(--text-muted)] mb-3" size={32} />
                      <p className="text-[var(--text-secondary)] text-sm mb-4">No targets set for today.</p>
                      <Link href="/planner">
                        <Button size="sm" variant="secondary">Set Targets</Button>
                      </Link>
                    </div>
                  ) : (
                    todayTargets.map(target => (
                      <div 
                        key={target.id}
                        onClick={() => handleToggleTarget(target.id)}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          target.completed 
                            ? 'bg-[var(--bg-tertiary)] border-transparent opacity-70' 
                            : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent-muted)]'
                        }`}
                      >
                        <button className="mt-0.5 shrink-0 transition-colors">
                          {target.completed ? (
                            <CheckCircle2 size={18} className="text-[var(--green)]" />
                          ) : (
                            <Circle size={18} className="text-[var(--text-muted)] hover:text-[var(--accent)]" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${target.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                            {target.topic?.name || 'Unknown Topic'}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)] truncate">
                            {target.topic?.subjectName}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {todayTargets.length > 0 && (
                  <Link href="/planner" className="mt-4 block">
                    <Button variant="ghost" className="w-full text-xs">View Full Planner</Button>
                  </Link>
                )}
              </Card>

            </div>
          </div>
        </>
      )}
    </div>
  );
}
