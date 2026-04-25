'use client';

import Card from '@/components/ui/Card';
import { AlertTriangle, TrendingDown } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';

export default function WeakTopicsCard({ weakTopics = [] }) {
  return (
    <Card className="h-full flex flex-col">
      <div className="mb-6 flex items-center gap-2">
        <AlertTriangle className="text-[var(--amber)]" size={20} />
        <h3 className="font-semibold">Identified Weak Areas</h3>
      </div>

      {weakTopics.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
          <TrendingDown className="text-[var(--text-muted)] mb-2" size={24} opacity={0.5} />
          <p className="text-[var(--text-secondary)] text-sm">No significant weak areas identified yet.</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Keep taking tests and tagging topics.</p>
        </div>
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {weakTopics.slice(0, 5).map((item, i) => (
            <div key={i} className="bg-[var(--bg-tertiary)] p-3 rounded-lg border border-[var(--border)]">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-[var(--text-primary)] truncate max-w-[70%]">
                  {item.topic}
                </span>
                <span className="text-xs font-mono font-bold text-[var(--red)]">
                  {item.avgScore}% avg
                </span>
              </div>
              <ProgressBar value={item.avgScore} max={100} height={4} color="var(--red)" />
              <p className="text-[10px] text-[var(--text-muted)] mt-2">
                Based on {item.testCount} test{item.testCount > 1 ? 's' : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
