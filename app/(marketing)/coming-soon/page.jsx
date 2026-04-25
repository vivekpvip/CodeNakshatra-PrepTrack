import Button from '@/components/ui/Button';
import { Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Coming Soon | PrepTrack',
  description: 'This feature is under construction. Check back soon.',
};

export default function ComingSoonPage() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden px-6 py-24">
      <div className="absolute inset-0 z-0 gradient-mesh" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-tertiary)]/50 backdrop-blur-md">
          <Sparkles size={14} className="text-[var(--accent)]" />
          <span className="text-sm font-medium text-[var(--accent)] tracking-wide">
            Under construction
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-glow-accent">
          Coming Soon
        </h1>
        <p className="text-lg text-[var(--text-secondary)] mb-10 leading-relaxed">
          We're putting the finishing touches on this page. Check back soon — in the meantime, head back to the homepage or explore what's already live.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="/" size="lg">Back to Home</Button>
          <Button href="/features" size="lg" variant="ghost">Explore Features</Button>
        </div>
      </div>
    </section>
  );
}
