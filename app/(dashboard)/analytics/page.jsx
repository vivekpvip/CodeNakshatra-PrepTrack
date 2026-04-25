'use client';

import { useMemo } from 'react';
import { useUser } from '@/hooks/useUser';
import { useTests } from '@/hooks/useTests';
import { useSyllabus } from '@/hooks/useSyllabus';
import { usePlanner } from '@/hooks/usePlanner';
import { getAllTopics, getSyllabus } from '@/lib/syllabus';
import Card from '@/components/ui/Card';
import { SkeletonCard } from '@/components/ui/Skeleton';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Radar, Doughnut } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, Filler);

export default function AnalyticsPage() {
  const { profile } = useUser();
  const { tests, loading: testsLoading } = useTests();
  const { progress, loading: syllabusLoading } = useSyllabus();
  const { targets, loading: plannerLoading } = usePlanner();

  const loading = testsLoading || syllabusLoading || plannerLoading;

  const topics = useMemo(() => {
    if (!profile?.exam_type) return [];
    return getAllTopics(profile.exam_type);
  }, [profile?.exam_type]);

  const syllabus = useMemo(() => {
    if (!profile?.exam_type) return null;
    return getSyllabus(profile.exam_type);
  }, [profile?.exam_type]);

  const radarData = useMemo(() => {
    if (!tests || tests.length === 0 || !syllabus) return null;

    // We want to group by subject or paper. Let's group by paper for the radar chart to keep points manageable
    const paperScores = {};
    const paperCounts = {};

    syllabus.papers.forEach(p => {
      paperScores[p.name] = 0;
      paperCounts[p.name] = 0;
    });

    // Map test tags to papers
    tests.forEach(test => {
      if (!test.topic_tags) return;
      
      test.topic_tags.forEach(tag => {
        // Find which paper this tag (topic name) belongs to
        const topicObj = topics.find(t => t.name.toLowerCase() === tag.toLowerCase());
        if (topicObj) {
          paperScores[topicObj.paperName] += Number(test.percentage);
          paperCounts[topicObj.paperName] += 1;
        }
      });
    });

    const labels = [];
    const data = [];

    Object.keys(paperScores).forEach(paper => {
      labels.push(paper.length > 15 ? paper.substring(0, 15) + '...' : paper);
      data.push(paperCounts[paper] > 0 ? Math.round(paperScores[paper] / paperCounts[paper]) : 0);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Average Score %',
          data,
          backgroundColor: 'rgba(108, 99, 255, 0.2)',
          borderColor: '#6c63ff',
          pointBackgroundColor: '#00d4aa',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#00d4aa',
          borderWidth: 2,
        },
      ],
    };
  }, [tests, syllabus, topics]);

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: '#9096b0', font: { family: "'Sora', sans-serif", size: 11 } },
        ticks: { display: false, min: 0, max: 100 },
      },
    },
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  };

  const doughnutData = useMemo(() => {
    if (!targets || targets.length === 0 || !topics.length) return null;

    const subjectCounts = {};
    const colors = ['#6c63ff', '#00d4aa', '#ffd166', '#ef476f', '#06d6a0', '#118ab2', '#073b4c'];

    targets.forEach(t => {
      if (t.completed) {
        const topic = topics.find(tp => tp.id === t.topic_id);
        if (topic) {
          const subject = topic.subjectName;
          subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
        }
      }
    });

    const labels = Object.keys(subjectCounts);
    if (labels.length === 0) return null;

    // Sort to get top 5
    const sortedLabels = labels.sort((a, b) => subjectCounts[b] - subjectCounts[a]).slice(0, 5);
    const data = sortedLabels.map(l => subjectCounts[l]);

    return {
      labels: sortedLabels,
      datasets: [
        {
          data,
          backgroundColor: colors.slice(0, sortedLabels.length),
          borderColor: '#1e2130',
          borderWidth: 2,
        },
      ],
    };
  }, [targets, topics]);

  const doughnutOptions = {
    cutout: '70%',
    plugins: {
      legend: { position: 'right', labels: { color: '#e8eaf0', usePointStyle: true, boxWidth: 8, font: { family: "'Sora', sans-serif", size: 12 } } }
    },
    maintainAspectRatio: false,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard height="150px" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard height="350px" />
          <SkeletonCard height="350px" />
        </div>
      </div>
    );
  }

  // Calculate some overview metrics
  const totalTopics = topics.length;
  const revisedTopics = Object.values(progress).filter(p => p.status === 'revised').length;
  const completionPct = totalTopics > 0 ? Math.round((revisedTopics / totalTopics) * 100) : 0;
  
  const completedTargets = targets.filter(t => t.completed).length;

  return (
    <div className="space-y-6 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Deep Analytics</h1>
        <p className="text-[var(--text-secondary)]">
          Insights into your preparation strategy and performance.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center" padding={true}>
          <p className="text-[var(--text-secondary)] text-sm mb-1">Syllabus Covered</p>
          <p className="text-3xl font-bold font-mono text-[var(--text-primary)]">{completionPct}%</p>
        </Card>
        <Card className="text-center" padding={true}>
          <p className="text-[var(--text-secondary)] text-sm mb-1">Targets Hit</p>
          <p className="text-3xl font-bold font-mono text-[var(--accent)] text-glow-accent">{completedTargets}</p>
        </Card>
        <Card className="text-center" padding={true}>
          <p className="text-[var(--text-secondary)] text-sm mb-1">Tests Logged</p>
          <p className="text-3xl font-bold font-mono text-[var(--teal)]">{tests.length}</p>
        </Card>
        <Card className="text-center" padding={true}>
          <p className="text-[var(--text-secondary)] text-sm mb-1">Total XP</p>
          <p className="text-3xl font-bold font-mono text-[var(--amber)]">{profile?.xp_points || 0}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="h-[400px] flex flex-col">
          <h3 className="font-semibold mb-2">Subject Performance Radar</h3>
          <p className="text-xs text-[var(--text-muted)] mb-6">Average test scores mapped across papers.</p>
          <div className="flex-1 relative">
            {radarData ? (
              <Radar data={radarData} options={radarOptions} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[var(--text-muted)] text-sm">
                Not enough test data with tags.
              </div>
            )}
          </div>
        </Card>

        <Card className="h-[400px] flex flex-col">
          <h3 className="font-semibold mb-2">Study Distribution</h3>
          <p className="text-xs text-[var(--text-muted)] mb-6">Which subjects you focus on the most (based on completed targets).</p>
          <div className="flex-1 relative">
            {doughnutData ? (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[var(--text-muted)] text-sm">
                No completed targets yet.
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold mb-4">Consistency Score</h3>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-32 h-32 shrink-0">
            {/* Simple CSS gauge */}
            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="var(--bg-tertiary)" strokeWidth="10" strokeLinecap="round" />
              <path 
                d="M 10 50 A 40 40 0 0 1 90 50" 
                fill="none" 
                stroke="url(#gaugeGradient)" 
                strokeWidth="10" 
                strokeLinecap="round"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (125.6 * (Math.min(profile?.streak || 0, 30) / 30))} 
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--red)" />
                  <stop offset="50%" stopColor="var(--amber)" />
                  <stop offset="100%" stopColor="var(--green)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute bottom-0 left-0 w-full text-center">
              <span className="text-2xl font-bold font-mono">{Math.min(Math.round(((profile?.streak || 0) / 30) * 100), 100)}</span>
              <span className="text-xs text-[var(--text-muted)] block -mt-1">/ 100</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="bg-[rgba(6,214,160,0.1)] border border-[rgba(6,214,160,0.2)] p-3 rounded-lg text-sm">
              <span className="font-semibold text-[var(--green)]">Tip:</span> Your consistency score is heavily tied to your daily streak. Keep hitting at least one target every day to improve it.
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--bg-tertiary)] p-3 rounded-lg">
                <p className="text-xs text-[var(--text-muted)] uppercase">Current Streak</p>
                <p className="text-lg font-bold">{profile?.streak || 0} days</p>
              </div>
              <div className="bg-[var(--bg-tertiary)] p-3 rounded-lg">
                <p className="text-xs text-[var(--text-muted)] uppercase">Best Streak</p>
                <p className="text-lg font-bold">{profile?.longest_streak || 0} days</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
