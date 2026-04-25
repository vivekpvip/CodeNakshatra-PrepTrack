'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const testimonials = [
  { name: 'Rahul S.', exam: 'UPSC CSE 2024 Aspirant', quote: 'The syllabus tracker is exactly what I needed. I finally know exactly what I have left to study.', rating: 5 },
  { name: 'Priya M.', exam: 'NEET UG', quote: 'The AI coach identified that my physics mechanics was weak before I even realized it. A game changer.', rating: 5 },
  { name: 'Amit K.', exam: 'JEE Advanced', quote: 'The streak system actually keeps me motivated. Logging my daily targets has become a habit.', rating: 4 },
  { name: 'Neha V.', exam: 'UPSC CSE', quote: 'No more switching between 10 Excel sheets. PrepTrack is the ultimate dashboard for serious prep.', rating: 5 },
  { name: 'Siddharth R.', exam: 'CAT Aspirant', quote: 'The UI is beautiful. It feels like a premium product, not a clunky student tool.', rating: 5 },
  { name: 'Ananya D.', exam: 'NEET UG', quote: 'Weekly AI plans save me hours of scheduling. I just log in and know what to do.', rating: 5 },
  { name: 'Vikram B.', exam: 'GATE CS', quote: 'Test analysis helped me improve my accuracy from 60% to 85% in two months.', rating: 4 },
  { name: 'Kavya T.', exam: 'JEE Main', quote: 'The SMS reminders are great. A gentle nudge every morning to stay on track.', rating: 5 },
];

export default function TestimonialsSlider() {
  const [width, setWidth] = useState(0);
  const carousel = useRef();
  const controls = useAnimation();
  const inView = useInView(carousel, { once: true });

  useEffect(() => {
    setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start({
        x: [0, -width],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        },
      });
    }
  }, [inView, width, controls]);

  return (
    <section className="py-24 bg-[var(--bg-primary)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <h2 className="mb-4">Loved by <span className="text-[var(--accent)]">Aspirants</span></h2>
        <p className="text-[var(--text-secondary)] text-lg">Join thousands of students who have streamlined their preparation.</p>
      </div>

      <motion.div 
        ref={carousel} 
        className="cursor-grab active:cursor-grabbing overflow-hidden"
      >
        <motion.div 
          drag="x" 
          dragConstraints={{ right: 0, left: -width }} 
          className="flex gap-6 px-6 pb-8 w-max"
          animate={controls}
          onHoverStart={() => controls.stop()}
          onHoverEnd={() => {
             controls.start({
                x: [carousel.current.getBoundingClientRect().x - carousel.current.parentElement.getBoundingClientRect().x, -width],
                transition: { repeat: Infinity, repeatType: "loop", duration: 30 * ((width + (carousel.current.getBoundingClientRect().x - carousel.current.parentElement.getBoundingClientRect().x)) / width), ease: "linear" }
             })
          }}
        >
          {testimonials.map((t, idx) => (
            <div 
              key={idx} 
              className="glass-card p-6 w-[350px] flex-shrink-0"
              style={{ pointerEvents: 'none' }} // Prevents drag issues on text
            >
              <div className="flex gap-1 mb-4 text-[var(--amber)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < t.rating ? 'opacity-100' : 'opacity-30'}>★</span>
                ))}
              </div>
              <p className="text-[var(--text-primary)] mb-6 italic leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center font-bold text-[var(--accent)] border border-[var(--border)]">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{t.name}</h4>
                  <p className="text-xs text-[var(--text-secondary)]">{t.exam}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
