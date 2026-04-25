'use client';

import { motion } from 'framer-motion';
import { Map, CalendarCheck, FileText, Bot, Flame, Bell } from 'lucide-react';
import Card from '@/components/ui/Card';

const features = [
  {
    icon: Map,
    title: 'Syllabus Heatmap Tracker',
    description: 'Visualise your progress across every paper, subject, and topic. Never lose track of what needs revision.',
    color: 'var(--accent)'
  },
  {
    icon: CalendarCheck,
    title: 'AI-Powered Daily Planner',
    description: 'Get personalised daily study targets based on your weak areas and exam timeline.',
    color: 'var(--teal)'
  },
  {
    icon: FileText,
    title: 'Mock Test Deep Analyser',
    description: 'Log your test scores and let AI pinpoint exactly which topics are dragging your accuracy down.',
    color: 'var(--amber)'
  },
  {
    icon: Bot,
    title: 'Claude AI Study Coach',
    description: 'A 24/7 intelligent coach that knows your progress and generates custom weekly study plans.',
    color: 'var(--accent)'
  },
  {
    icon: Flame,
    title: 'Streak & XP Gamification',
    description: 'Stay consistent. Earn XP for completing daily targets and build an unbreakable study streak.',
    color: 'var(--amber)'
  },
  {
    icon: Bell,
    title: 'SMS Study Reminders',
    description: 'Receive morning texts with your daily targets. Set up custom nudges to keep you disciplined.',
    color: 'var(--teal)'
  }
];

export default function FeaturesGrid() {
  return (
    <section className="py-24 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="mb-4">Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--teal)]">succeed.</span></h2>
          <p className="text-[var(--text-secondary)] text-lg">
            Say goodbye to scattered notebooks and generic advice. PrepTrack brings all your preparation into one intelligent dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Card className="h-full flex flex-col items-start" hover>
                <div 
                  className="p-3 rounded-lg mb-6 shadow-lg"
                  style={{ 
                    backgroundColor: `${feature.color}15`,
                    color: feature.color,
                    border: `1px solid ${feature.color}30`
                  }}
                >
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
