'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function HeroSection() {
  const [text, setText] = useState('');
  const [particles, setParticles] = useState([]);
  const fullText = 'Your Exam. Your Command Center.';

  useEffect(() => {
    setParticles(
      Array.from({ length: 25 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${10 + Math.random() * 20}s`,
      }))
    );
  }, []);

  useEffect(() => {
    let currentText = '';
    let index = 0;

    const intervalId = setInterval(() => {
      currentText += fullText[index];
      setText(currentText);
      index++;

      if (index === fullText.length) {
        clearInterval(intervalId);
      }
    }, 100); // 100ms per character typing speed

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-32">
      {/* Background with mesh and grain */}
      <div className="absolute inset-0 z-0 gradient-mesh" />
      <div className="absolute inset-0 z-0 grain-overlay" />
      
      {/* Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {particles.map((p, i) => (
          <div key={i} className="particle" style={p} />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-tertiary)]/50 backdrop-blur-md">
            <span className="text-sm font-medium text-[var(--accent)] tracking-wide">
              ✨ Introducing PrepTrack AI Coach
            </span>
          </div>
          
          <h1 className="mb-6 h-[120px] md:h-[auto] flex flex-col md:block items-center justify-center">
            <span className="typing-cursor inline-block">
              {text}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
            The AI-powered study OS for UPSC, JEE & NEET aspirants who are serious about cracking it. Track topics, analyze tests, and get intelligent daily plans.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/signup" size="lg" className="w-full sm:w-auto shadow-[0_0_30px_var(--accent-glow)]">
              Get Started Free
            </Button>
            <Button href="#how-it-works" size="lg" variant="ghost" className="w-full sm:w-auto">
              See How It Works
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
