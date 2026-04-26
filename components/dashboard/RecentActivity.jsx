'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, FileText, BookOpen, Sparkles } from 'lucide-react';
import Card from '@/components/ui/Card';
import { timeAgo } from '@/lib/utils';

const ICONS = {
  target: CheckCircle2,
  test: FileText,
  topic: BookOpen,
  coach: Sparkles,
};

const COLORS = {
  target: 'var(--green)',
  test: 'var(--accent)',
  topic: 'var(--teal)',
  coach: 'var(--amber)',
};

/**
 * Show a feed of recent user actions.
 * Props:
 *   targets:  daily_targets rows (with completed, completed_at)
 *   tests:    test_results rows
 *   progress: topic_progress rows (with status, updated_at)
 *   topics:   flat array of syllabus topics (for name lookup)
 */
export default function RecentActivity({ targets = [], tests = [], progress = {}, topics = [], limit = 8 }) {
  const items = useMemo(() => {
    const list = [];

    targets.forEach((t) => {
      if (t.completed && t.completed_at) {
        const topic = topics.find((tp) => tp.id === t.topic_id);
        list.push({
          id: `target-${t.id}`,
          type: 'target',
          text: `Completed ${topic?.name || 'a target'}`,
          at: t.completed_at,
        });
      }
    });

    tests.forEach((test) => {
      list.push({
        id: `test-${test.id}`,
        type: 'test',
        text: `Logged ${test.test_name} — ${Math.round(Number(test.percentage || 0))}%`,
        at: test.created_at,
      });
    });

    Object.values(progress).forEach((p) => {
      if (p.status === 'revised' || p.status === 'in_progress') {
        const topic = topics.find((tp) => tp.id === p.topic_id);
        list.push({
          id: `topic-${p.topic_id}`,
          type: 'topic',
          text: `${p.status === 'revised' ? 'Revised' : 'Started'} ${topic?.name || p.topic_id}`,
          at: p.updated_at,
        });
      }
    });

    return list
      .filter((i) => i.at)
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, limit);
  }, [targets, tests, progress, topics, limit]);

  return (
    <Card hover={false}>
      <h3 className="font-semibold mb-4">Recent Activity</h3>
      {items.length === 0 ? (
        <div className="text-center py-6 text-sm text-[var(--text-muted)]">
          Your actions will appear here once you start studying.
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item, idx) => {
            const Icon = ICONS[item.type];
            const color = COLORS[item.type];
            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="flex items-start gap-3"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
                >
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text-primary)] truncate">{item.text}</p>
                  <p className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
                    {timeAgo(item.at)}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
