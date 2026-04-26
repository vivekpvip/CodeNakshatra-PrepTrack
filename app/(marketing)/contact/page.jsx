'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, AtSign, Briefcase, ChevronDown, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';

const FAQ = [
  { q: 'Is PrepTrack free?', a: 'Yes — the Free tier covers one exam, basic test analysis, and 10 AI Coach messages per month. Pro unlocks all exams and unlimited AI usage.' },
  { q: 'Which exams do you support?', a: 'UPSC, JEE Main + Advanced, NEET, CAT, GATE, and select State PSCs at launch. More are being added monthly.' },
  { q: 'Where is my data stored?', a: 'In a managed Supabase Postgres database. Row-level security means only you can read your data — even our admin team cannot read your notes.' },
  { q: 'Does the AI Coach actually know my progress?', a: 'Yes. Every Coach call sends Claude your real syllabus completion, test history, and weak topics so its advice is personal, not generic.' },
  { q: 'Can I export my data?', a: 'CSV export of test results and syllabus progress ships in v1.1. Account deletion already wipes everything immediately.' },
  { q: 'How do SMS reminders work?', a: 'When enabled, your daily targets are sent via Twilio at the time you choose. Standard carrier rates apply.' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', examType: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [openIdx, setOpenIdx] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      return toast.error('Name, email, and message are required.');
    }
    setLoading(true);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: 'contact-form', payload: form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      toast.success("Message sent. We'll reply within 24 hours.");
      setForm({ name: '', email: '', examType: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-24 bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Get in <span className="text-[var(--amber)]">touch</span></h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Questions, feedback, or partnership ideas — we read everything.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-2">Reach us directly</h2>
              <p className="text-[var(--text-secondary)] text-sm mb-6">
                Or send a note via the form — whichever is easier.
              </p>
              <div className="space-y-3">
                <a href="mailto:hello@preptrack.in" className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)] transition-colors">
                  <Mail className="text-[var(--accent)]" size={20} />
                  <span>hello@preptrack.in</span>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)] transition-colors">
                  <AtSign className="text-[var(--teal)]" size={20} />
                  <span>@preptrack on X / Twitter</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)] transition-colors">
                  <Briefcase className="text-[var(--accent)]" size={20} />
                  <span>linkedin.com/company/preptrack</span>
                </a>
              </div>
              <div className="mt-6 inline-block px-3 py-1.5 rounded-full bg-[var(--green-glow)] text-[var(--green)] text-xs font-medium">
                We reply within 24 hours
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="input" required />
              </div>
              <div>
                <label className="label">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="input" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Exam type</label>
                <select name="examType" value={form.examType} onChange={handleChange} className="input">
                  <option value="">Select…</option>
                  <option value="upsc">UPSC</option>
                  <option value="jee">JEE</option>
                  <option value="neet">NEET</option>
                  <option value="cat">CAT</option>
                  <option value="gate">GATE</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="label">Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} className="input" placeholder="What's this about?" />
              </div>
            </div>
            <div>
              <label className="label">Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} className="input min-h-[140px]" required />
            </div>
            <Button type="submit" loading={loading} icon={Send} className="w-full py-3">
              Send message
            </Button>
          </form>
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently asked questions</h2>
          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <div key={i} className="border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--bg-card)]">
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[rgba(255,255,255,0.02)]"
                >
                  <span className="font-medium">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-[var(--text-muted)] transition-transform ${openIdx === i ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openIdx === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm text-[var(--text-secondary)] leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
