'use client';

import { useState } from 'react';
import { Share2, Download, Copy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { getExamName } from '@/lib/utils';
import toast from 'react-hot-toast';

/**
 * Generates a shareable progress card as an SVG and offers download / copy.
 * Pure SVG — no html2canvas dependency needed.
 */
export default function ShareCard({ profile, completion = 0, streak = 0 }) {
  const [open, setOpen] = useState(false);

  const examName = getExamName(profile?.exam_type);
  const name = profile?.full_name || 'PrepTrack Aspirant';
  const xp = profile?.xp_points || 0;

  const svg = buildSvg({ name, examName, completion, streak, xp });
  const dataUrl = `data:image/svg+xml;base64,${typeof window !== 'undefined' ? btoa(unescape(encodeURIComponent(svg))) : ''}`;

  const download = () => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `preptrack-progress-${Date.now()}.svg`;
    a.click();
    toast.success('Progress card downloaded.');
  };

  const copyText = async () => {
    const txt = `🎯 ${completion}% syllabus done · 🔥 ${streak}-day streak · ${xp} XP\nMy ${examName} prep on PrepTrack.`;
    try {
      await navigator.clipboard.writeText(txt);
      toast.success('Caption copied to clipboard.');
    } catch {
      toast.error('Copy failed.');
    }
  };

  return (
    <>
      <Button variant="secondary" icon={Share2} size="sm" onClick={() => setOpen(true)}>
        Share progress
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-6 max-w-md w-full"
              style={{ background: 'var(--bg-card)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Share your progress</h3>
                <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-[rgba(255,255,255,0.05)]">
                  <X size={18} />
                </button>
              </div>

              <div className="rounded-xl overflow-hidden border border-[var(--border)] mb-4">
                <img src={dataUrl} alt="Progress card preview" className="w-full" />
              </div>

              <div className="flex gap-3">
                <Button onClick={download} icon={Download} className="flex-1">
                  Download
                </Button>
                <Button variant="secondary" onClick={copyText} icon={Copy}>
                  Copy caption
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function buildSvg({ name, examName, completion, streak, xp }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#13151e"/>
      <stop offset="100%" stop-color="#0c0e14"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.15" r="0.6">
      <stop offset="0%" stop-color="#6c63ff" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#6c63ff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.1" cy="0.9" r="0.6">
      <stop offset="0%" stop-color="#00d4aa" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#00d4aa" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="420" fill="url(#bg)" rx="20"/>
  <rect width="800" height="420" fill="url(#glow)"/>
  <rect width="800" height="420" fill="url(#glow2)"/>

  <!-- Logo -->
  <g transform="translate(40,40)">
    <rect width="38" height="38" rx="8" fill="#6c63ff"/>
    <text x="19" y="26" text-anchor="middle" font-family="Sora,sans-serif" font-size="22" font-weight="700" fill="#fff">P</text>
    <text x="50" y="26" font-family="Sora,sans-serif" font-size="20" font-weight="700" fill="#e8eaf0">Prep<tspan fill="#6c63ff">Track</tspan></text>
  </g>

  <!-- Name + exam -->
  <text x="40" y="160" font-family="Sora,sans-serif" font-size="38" font-weight="800" fill="#e8eaf0">${escape(name)}</text>
  <text x="40" y="190" font-family="JetBrains Mono,monospace" font-size="14" fill="#9096b0">${escape(examName)} • PrepTrack</text>

  <!-- Stats grid -->
  <g transform="translate(40,230)">
    ${stat(0, '#6c63ff', `${completion}%`, 'syllabus done')}
    ${stat(250, '#ffd166', `${streak}d`, 'streak')}
    ${stat(500, '#00d4aa', xp.toString(), 'XP earned')}
  </g>

  <text x="400" y="395" text-anchor="middle" font-family="Sora,sans-serif" font-size="12" fill="#555c78">Track yours at preptrack.in</text>
</svg>`;
}

function stat(x, color, value, label) {
  return `
    <g transform="translate(${x},0)">
      <rect width="220" height="120" rx="14" fill="rgba(255,255,255,0.03)" stroke="${color}" stroke-opacity="0.3"/>
      <text x="20" y="55" font-family="JetBrains Mono,monospace" font-size="46" font-weight="700" fill="${color}">${value}</text>
      <text x="20" y="90" font-family="Sora,sans-serif" font-size="13" fill="#9096b0">${label}</text>
    </g>`;
}

function escape(s) {
  return String(s).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
}
