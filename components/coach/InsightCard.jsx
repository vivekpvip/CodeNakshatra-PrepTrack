'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Lightbulb, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';

/**
 * Reusable insight bubble shown on the dashboard.
 * Pass `insight` text directly, or it picks a context-aware default
 * based on the user's stats.
 */
export default function InsightCard({ profile, completion, weakTopics = [], insight }) {
  const text =
    insight ||
    deriveInsight({ profile, completion, weakTopics });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden border border-[var(--accent-glow)] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-tertiary)] rounded-2xl p-6"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 text-[var(--accent)] pointer-events-none">
        <Lightbulb size={120} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-[0_0_15px_var(--accent-glow)]">
            <Sparkles size={14} className="text-white" />
          </div>
          <h3 className="font-semibold text-lg text-[var(--accent)] text-glow-accent">
            Coach Insight
          </h3>
        </div>
        <p className="text-[var(--text-primary)] leading-relaxed mb-4 max-w-2xl">{text}</p>
        <Link href="/coach">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowRight}
            className="text-[var(--accent)] hover:bg-[var(--accent-muted)]"
          >
            Ask Coach for a plan
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

function deriveInsight({ profile, completion = 0, weakTopics = [] }) {
  const name = profile?.full_name?.split(' ')[0] || 'aspirant';
  const streak = profile?.streak || 0;

  if (weakTopics.length > 0) {
    return `${name}, your tests show weakness in ${weakTopics.slice(0, 2).join(' and ')}. Spend your next 2 sessions there — small, focused revisions move the needle fastest.`;
  }
  if (completion < 25) {
    return `${name}, you're at ${completion}% syllabus coverage. Pick one subject and aim for 60% completion before branching out — depth beats breadth early on.`;
  }
  if (streak >= 7) {
    return `${streak}-day streak — you're in the zone, ${name}. Now is the time to layer in a weekly mock test and convert consistency into accuracy.`;
  }
  return `${name}, your progress is steady. Open the planner and lock in 3 specific topic targets for tomorrow — clarity compounds.`;
}
