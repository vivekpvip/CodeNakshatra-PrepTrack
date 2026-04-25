'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail, MessageCircle, Briefcase, Code, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const footerLinks = {
  product: [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'AI Coach', href: '/coach' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: '/coming-soon' },
    { label: 'Careers', href: '/coming-soon' },
  ],
  resources: [
    { label: 'UPSC Guide', href: '/coming-soon' },
    { label: 'JEE Tips', href: '/coming-soon' },
    { label: 'NEET Strategy', href: '/coming-soon' },
    { label: 'Study Materials', href: '/resources' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Subscribed successfully! 🎉');
    setEmail('');
  };

  return (
    <footer className="relative border-t border-[var(--border)]" style={{ background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)' }}>
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center font-bold text-white text-sm"
                style={{ boxShadow: '0 0 20px var(--accent-glow)' }}>
                P
              </div>
              <span className="text-lg font-bold">
                Prep<span className="text-[var(--accent)]">Track</span>
              </span>
            </Link>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6 max-w-sm">
              The AI-powered study operating system for serious exam aspirants. 
              Track your syllabus, ace your mocks, and get coached by AI — all in one place.
            </p>
            
            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input text-sm flex-1"
                style={{ padding: '8px 14px' }}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                aria-label="Subscribe to newsletter"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-[var(--text-primary)]">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-[var(--text-primary)]">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-[var(--text-primary)]">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} PrepTrack. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="/coming-soon" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors" aria-label="Community">
              <MessageCircle size={18} />
            </a>
            <a href="/coming-soon" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors" aria-label="Careers">
              <Briefcase size={18} />
            </a>
            <a href="/coming-soon" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors" aria-label="Developers">
              <Code size={18} />
            </a>
            <a href="/coming-soon" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors" aria-label="Email">
              <Mail size={18} />
            </a>
          </div>
          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <a href="/coming-soon" className="hover:text-[var(--text-secondary)] transition-colors">Terms</a>
            <a href="/coming-soon" className="hover:text-[var(--text-secondary)] transition-colors">Privacy</a>
            <a href="/coming-soon" className="hover:text-[var(--text-secondary)] transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
