'use client';

import { motion } from 'framer-motion';

export default function ProgressBar({ 
  value = 0, 
  max = 100, 
  color = 'linear-gradient(90deg, var(--accent), var(--teal))',
  height = 8,
  showLabel = false,
  className = '' 
}) {
  const percent = Math.min(Math.round((value / max) * 100), 100);
  
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-[var(--text-secondary)] font-mono">{percent}%</span>
          <span className="text-xs text-[var(--text-muted)] font-mono">{value}/{max}</span>
        </div>
      )}
      <div 
        className="w-full bg-[var(--bg-tertiary)] overflow-hidden"
        style={{ height: `${height}px`, borderRadius: '9999px' }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          style={{ 
            height: '100%', 
            background: color,
            borderRadius: '9999px',
          }}
        />
      </div>
    </div>
  );
}
