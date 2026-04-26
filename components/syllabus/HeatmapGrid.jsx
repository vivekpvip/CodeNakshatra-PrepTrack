'use client';

import { useMemo } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import Card from '@/components/ui/Card';
import { getStatusColor, getStatusLabel } from '@/lib/utils';

/**
 * Grid view of syllabus completion.
 * Each subject is a row; each topic is a coloured square.
 */
export default function HeatmapGrid({ syllabus, progress }) {
  const subjects = useMemo(() => {
    if (!syllabus) return [];
    return syllabus.papers.flatMap((paper) =>
      paper.subjects.map((s) => ({ ...s, paperName: paper.name }))
    );
  }, [syllabus]);

  if (!syllabus) return null;

  return (
    <Card hover={false}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Syllabus Heatmap</h3>
        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
          <Legend color="var(--text-muted)" label="Not started" />
          <Legend color="var(--amber)" label="In progress" />
          <Legend color="var(--green)" label="Revised" />
        </div>
      </div>

      <Tooltip.Provider delayDuration={80}>
        <div className="space-y-3">
          {subjects.map((subject) => (
            <div key={subject.id} className="flex items-center gap-3">
              <div className="w-40 shrink-0 text-xs text-[var(--text-secondary)] truncate" title={`${subject.paperName} • ${subject.name}`}>
                {subject.name}
              </div>
              <div className="flex flex-wrap gap-1">
                {subject.topics.map((topic) => {
                  const status = progress[topic.id]?.status || 'not_started';
                  const color = getStatusColor(status);
                  return (
                    <Tooltip.Root key={topic.id}>
                      <Tooltip.Trigger asChild>
                        <div
                          className="w-3.5 h-3.5 rounded-[3px] transition-transform hover:scale-125 cursor-pointer"
                          style={{
                            backgroundColor: status === 'not_started' ? 'var(--bg-tertiary)' : color,
                            border: status === 'not_started' ? '1px solid var(--border)' : 'none',
                          }}
                        />
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className="bg-[var(--bg-card)] border border-[var(--border)] px-2.5 py-1.5 rounded text-xs text-[var(--text-primary)] shadow-xl z-50"
                          sideOffset={5}
                        >
                          <div className="font-semibold">{topic.name}</div>
                          <div className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color }}>
                            {getStatusLabel(status)}
                          </div>
                          <Tooltip.Arrow className="fill-[var(--border)]" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Tooltip.Provider>
    </Card>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-2.5 h-2.5 rounded-[2px]"
        style={{
          backgroundColor: color === 'var(--text-muted)' ? 'var(--bg-tertiary)' : color,
          border: color === 'var(--text-muted)' ? '1px solid var(--border)' : 'none',
        }}
      />
      <span>{label}</span>
    </div>
  );
}
