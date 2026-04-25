'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: 12000, label: 'Students', suffix: '+' },
  { value: 4.8, label: 'Average Rating', suffix: '★', decimals: 1 },
  { value: 85, label: 'Score Improvement', suffix: '%' },
  { value: 50, label: 'Exams Covered', suffix: '+' },
];

function AnimatedCounter({ value, decimals = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutExpo)
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        setCount(start + (value - start) * easeProgress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(value);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count.toFixed(decimals)}</span>;
}

export default function StatsBanner() {
  return (
    <section className="py-12 border-y border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="flex flex-col items-center justify-center space-y-2"
            >
              <div className="text-3xl md:text-4xl font-bold font-mono text-[var(--text-primary)] tracking-tight">
                <AnimatedCounter value={stat.value} decimals={stat.decimals} />
                <span className="text-[var(--accent)] ml-1">{stat.suffix}</span>
              </div>
              <div className="text-sm md:text-base font-medium text-[var(--text-secondary)]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
