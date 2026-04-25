'use client';

import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Calendar, Clock, Target, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WeeklyPlanCard({ plan, onAddAllToPlanner }) {
  if (!plan || !Array.isArray(plan)) return null;

  return (
    <Card className="border-[var(--teal)] shadow-[0_0_30px_var(--teal-glow)] relative overflow-hidden" padding={false}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--teal)] opacity-[0.05] rounded-full blur-[50px] pointer-events-none" />
      
      <div className="p-6 border-b border-[var(--border)]">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
          <Calendar className="text-[var(--teal)]" />
          AI Generated Weekly Plan
        </h3>
        <p className="text-[var(--text-secondary)] text-sm">
          Based on your weak areas and exam timeline, here is your recommended schedule for the next 7 days.
        </p>
      </div>

      <div className="divide-y divide-[var(--border)]">
        {plan.map((dayPlan, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 hover:bg-[rgba(255,255,255,0.01)] transition-colors"
          >
            <div className="sm:w-32 shrink-0">
              <h4 className="font-bold text-[var(--teal)]">{dayPlan.day}</h4>
              <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] mt-1">
                <Clock size={12} />
                <span>{dayPlan.hours} hours focus</span>
              </div>
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--text-primary)] mb-2">
                Focus: {dayPlan.focus}
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(dayPlan.topics) && dayPlan.topics.map((topic, tIdx) => (
                  <span 
                    key={tIdx} 
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-secondary)]"
                  >
                    <Target size={10} className="text-[var(--accent)]" />
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-6 bg-[var(--bg-tertiary)] border-t border-[var(--border)]">
        <Button 
          className="w-full" 
          variant="teal" 
          icon={Plus}
          onClick={() => {
            onAddAllToPlanner();
            toast.success('Action simulated: Topics added to planner (requires backend wiring)');
          }}
        >
          Add Plan to Daily Targets
        </Button>
      </div>
    </Card>
  );
}
