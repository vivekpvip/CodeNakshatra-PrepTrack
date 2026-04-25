import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Check } from 'lucide-react';

export const metadata = { title: 'Pricing | PrepTrack' };

export default function PricingPage() {
  return (
    <div className="min-h-[80vh] py-24 bg-[var(--bg-primary)] flex flex-col items-center">
      <div className="text-center mb-16 max-w-2xl px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, transparent <span className="text-[var(--accent)]">pricing.</span></h1>
        <p className="text-xl text-[var(--text-secondary)]">Start for free, upgrade when you need AI superpowers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-6 w-full">
        {/* Free Tier */}
        <div className="glass-card p-8 flex flex-col h-full border border-[var(--border)]">
          <h3 className="text-2xl font-bold mb-2">Free</h3>
          <p className="text-[var(--text-secondary)] mb-6">Everything you need to organize your prep.</p>
          <div className="text-4xl font-bold font-mono mb-8">₹0<span className="text-lg text-[var(--text-muted)] font-sans">/mo</span></div>
          
          <ul className="space-y-4 mb-8 flex-1">
            {['1 Exam Type', 'Full Syllabus Tracking', 'Daily Planner', 'Basic Test Analysis', '10 AI Coach Messages/mo'].map((feat, i) => (
              <li key={i} className="flex items-center gap-3 text-[var(--text-primary)]">
                <Check size={18} className="text-[var(--teal)] shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
          <Link href="/signup" className="block mt-auto">
            <Button variant="secondary" className="w-full">Get Started Free</Button>
          </Link>
        </div>

        {/* Pro Tier */}
        <div className="glass-card p-8 flex flex-col h-full border-2 border-[var(--accent)] relative shadow-[0_0_40px_var(--accent-glow)] transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--accent)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
            Most Popular
          </div>
          <h3 className="text-2xl font-bold mb-2">Pro</h3>
          <p className="text-[var(--text-secondary)] mb-6">AI-powered insights to boost your rank.</p>
          <div className="text-4xl font-bold font-mono mb-8 text-[var(--accent)]">₹199<span className="text-lg text-[var(--text-muted)] font-sans">/mo</span></div>
          
          <ul className="space-y-4 mb-8 flex-1">
            {['All Exams Supported', 'Unlimited AI Coach Chat', 'AI Weekly Plan Generation', 'Advanced Weakness Analytics', 'SMS Daily Reminders'].map((feat, i) => (
              <li key={i} className="flex items-center gap-3 text-[var(--text-primary)]">
                <Check size={18} className="text-[var(--accent)] shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
          <Link href="/signup" className="block mt-auto">
            <Button className="w-full">Upgrade to Pro</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
