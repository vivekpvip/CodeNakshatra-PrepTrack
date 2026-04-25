'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Flame, Calendar, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';

export default function StatsRow({ profile, completionStats, testStats }) {
  const [daysToExam, setDaysToExam] = useState(null);

  useEffect(() => {
    if (profile?.exam_date) {
      const target = new Date(profile.exam_date);
      const now = new Date();
      const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
      setDaysToExam(diff > 0 ? diff : 0);
    }
  }, [profile?.exam_date]);

  const statCards = [
    {
      title: 'Syllabus Progress',
      value: `${completionStats?.completionPercent || 0}%`,
      subtitle: `${completionStats?.revised || 0} / ${completionStats?.total || 0} topics mastered`,
      icon: Target,
      color: 'var(--accent)',
      progress: completionStats?.completionPercent || 0,
    },
    {
      title: 'Study Streak',
      value: profile?.streak || 0,
      subtitle: `Longest: ${profile?.longest_streak || 0} days`,
      icon: Flame,
      color: 'var(--amber)',
    },
    {
      title: 'Days to Exam',
      value: daysToExam !== null ? daysToExam : '--',
      subtitle: profile?.exam_date ? new Date(profile.exam_date).toLocaleDateString() : 'Exam date not set',
      icon: Calendar,
      color: 'var(--teal)',
    },
    {
      title: 'Avg Test Score',
      value: `${testStats?.average || 0}%`,
      subtitle: `Based on ${testStats?.count || 0} tests`,
      icon: TrendingUp,
      color: 'var(--green)',
      progress: testStats?.average || 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {statCards.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.5 }}
        >
          <Card className="h-full flex flex-col justify-between" hover={true} padding={true}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">{stat.title}</p>
                <h3 className="text-2xl md:text-3xl font-bold font-mono text-[var(--text-primary)]">
                  {stat.value}
                </h3>
              </div>
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                style={{ 
                  backgroundColor: `${stat.color}15`,
                  color: stat.color,
                  border: `1px solid ${stat.color}30`
                }}
              >
                <stat.icon size={20} />
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-[rgba(255,255,255,0.05)]">
              {stat.progress !== undefined ? (
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <ProgressBar value={stat.progress} max={100} height={6} color={stat.color} />
                  </div>
                  <span className="text-xs text-[var(--text-muted)] font-medium whitespace-nowrap">
                    {stat.subtitle}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-[var(--text-muted)] font-medium truncate">
                  {stat.subtitle}
                </p>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
