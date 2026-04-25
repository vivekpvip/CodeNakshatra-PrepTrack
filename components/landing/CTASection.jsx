'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)] z-0" />
      
      {/* Glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent)] opacity-[0.05] rounded-full blur-[100px] z-0" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-12 md:p-16 rounded-3xl gradient-border text-center flex flex-col items-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow-accent">
            Start your 0-to-prepared journey today.
          </h2>
          <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-2xl">
            Join the ranks of organized, stress-free aspirants. Create your account, set your target, and let PrepTrack guide your daily study.
          </p>
          
          <Link href="/signup">
            <Button size="lg" className="px-10 py-4 text-lg shadow-[0_0_40px_var(--accent-glow)] rounded-xl">
              Create Free Account
            </Button>
          </Link>
          <p className="mt-6 text-sm text-[var(--text-muted)]">
            No credit card required. Free tier includes syllabus tracking and basic analytics.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
