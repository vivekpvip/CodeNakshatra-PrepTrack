'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: 'Choose your exam',
    description: 'Select UPSC, JEE, NEET or others. Set your target exam date and tell us where you currently stand.',
  },
  {
    num: '02',
    title: 'Track daily progress',
    description: 'Mark topics as completed, log mock test scores, and hit your daily AI-generated targets to earn XP.',
  },
  {
    num: '03',
    title: 'Refine and conquer',
    description: 'Let the AI analyze your weak spots, adjust your weekly plan, and walk into the exam hall fully prepared.',
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[var(--bg-secondary)] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="mb-4">The path to <span className="text-[var(--teal)]">preparedness</span></h2>
          <p className="text-[var(--text-secondary)] text-lg">A simple, effective process designed by top rankers.</p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-[var(--border)]" />
          <div className="hidden md:block absolute top-12 left-[10%] h-0.5 bg-[var(--accent)] transition-all duration-1000 origin-left" style={{ width: '80%' }} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step Circle */}
                <div className="w-24 h-24 rounded-full bg-[var(--bg-primary)] border-4 border-[var(--bg-secondary)] flex items-center justify-center mb-6 relative z-10 glow-accent shadow-lg text-2xl font-bold font-mono text-[var(--text-primary)]">
                  {step.num}
                </div>
                
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed max-w-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
