'use client';

import { useMemo } from 'react';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import * as Tooltip from '@radix-ui/react-tooltip';

export default function ActivityHeatmap({ targets = [] }) {
  const weeks = 12; // Show last 12 weeks
  const daysPerWeek = 7;
  
  // Generate the last 12 weeks of dates
  const heatmapData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Start from Sunday of the first week
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (today.getDay() + (weeks - 1) * 7));
    
    const activityMap = new Map();
    
    // Count completed targets per date
    targets.forEach(t => {
      if (t.completed && t.completed_at) {
        const dateStr = t.target_date;
        activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
      }
    });

    const grid = [];
    let currentDate = new Date(startDate);
    
    for (let w = 0; w < weeks; w++) {
      const week = [];
      for (let d = 0; d < daysPerWeek; d++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const count = activityMap.get(dateStr) || 0;
        
        let level = 0;
        if (count > 0) level = 1;
        if (count > 2) level = 2;
        if (count > 4) level = 3;
        if (count > 6) level = 4;

        week.push({
          date: dateStr,
          dateObj: new Date(currentDate),
          count,
          level,
          isFuture: currentDate > today
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      grid.push(week);
    }
    
    return grid;
  }, [targets, weeks]);

  const getColorClass = (level) => {
    switch (level) {
      case 4: return 'bg-[var(--accent)]';
      case 3: return 'bg-[var(--accent)] opacity-80';
      case 2: return 'bg-[var(--accent)] opacity-50';
      case 1: return 'bg-[var(--accent)] opacity-30';
      default: return 'bg-[var(--bg-tertiary)]';
    }
  };

  const monthLabels = useMemo(() => {
    const labels = [];
    let currentMonth = -1;
    
    heatmapData.forEach((week, i) => {
      if (!week[0]) return;
      const month = week[0].dateObj.getMonth();
      if (month !== currentMonth) {
        labels.push({ index: i, label: week[0].dateObj.toLocaleString('default', { month: 'short' }) });
        currentMonth = month;
      }
    });
    return labels;
  }, [heatmapData]);

  return (
    <Card className="overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-[var(--text-primary)]">Study Activity</h3>
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-[2px] bg-[var(--bg-tertiary)]" />
            <div className="w-3 h-3 rounded-[2px] bg-[var(--accent)] opacity-30" />
            <div className="w-3 h-3 rounded-[2px] bg-[var(--accent)] opacity-50" />
            <div className="w-3 h-3 rounded-[2px] bg-[var(--accent)] opacity-80" />
            <div className="w-3 h-3 rounded-[2px] bg-[var(--accent)]" />
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="flex">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] pr-2 pt-5 text-[10px] text-[var(--text-muted)] font-medium justify-between h-[105px]">
          <span className="leading-3 h-3">Sun</span>
          <span className="leading-3 h-3">Tue</span>
          <span className="leading-3 h-3">Thu</span>
          <span className="leading-3 h-3">Sat</span>
        </div>

        <div className="flex-1 overflow-x-auto pb-2 scrollbar-hide">
          <div className="min-w-max">
            {/* Month labels */}
            <div className="flex relative h-5 mb-1">
              {monthLabels.map(({ index, label }, i) => (
                <span 
                  key={i} 
                  className="absolute text-[10px] text-[var(--text-muted)] font-medium"
                  style={{ left: `${index * (12 + 3)}px` }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Grid */}
            <Tooltip.Provider delayDuration={100}>
              <div className="flex gap-[3px]">
                {heatmapData.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-[3px]">
                    {week.map((day, dIdx) => (
                      <Tooltip.Root key={`${wIdx}-${dIdx}`}>
                        <Tooltip.Trigger asChild>
                          <div 
                            className={cn(
                              'w-3 h-3 rounded-[2px] transition-colors',
                              getColorClass(day.level),
                              day.isFuture && 'opacity-10 bg-[var(--bg-tertiary)]'
                            )}
                          />
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content 
                            className="bg-[var(--bg-card)] border border-[var(--border)] px-3 py-1.5 rounded text-xs text-[var(--text-primary)] shadow-xl z-50 animate-in fade-in zoom-in-95"
                            sideOffset={5}
                          >
                            {day.isFuture ? (
                              'Future date'
                            ) : (
                              <>
                                <span className="font-semibold text-[var(--accent)]">{day.count}</span>
                                {' '}targets on {day.dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </>
                            )}
                            <Tooltip.Arrow className="fill-[var(--border)]" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    ))}
                  </div>
                ))}
              </div>
            </Tooltip.Provider>
          </div>
        </div>
      </div>
    </Card>
  );
}
