'use client';

import { motion } from 'framer-motion';

export default function ProgressRing({
  value = 0,
  max = 100,
  size = 120,
  stroke = 10,
  color = 'var(--accent)',
  bg = 'var(--bg-tertiary)',
  label,
  sublabel,
}) {
  const pct = Math.max(0, Math.min(1, value / max));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);
  const display = Math.round(pct * 100);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bg}
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-mono font-bold text-2xl" style={{ color }}>
          {label ?? `${display}%`}
        </span>
        {sublabel && (
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mt-0.5">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
