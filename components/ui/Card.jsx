'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Card({
  children,
  className = '',
  hover = true,
  glow = false,
  gradient = false,
  padding = true,
  onClick,
  ...props
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.01 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'glass-card',
        hover && 'glass-card-hover cursor-pointer',
        glow && 'glow-accent',
        gradient && 'gradient-border',
        padding && 'p-6',
        'transition-all duration-300',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}
