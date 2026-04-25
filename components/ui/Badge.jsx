'use client';

import { cn } from '@/lib/utils';

const badgeVariants = {
  accent: 'badge-accent',
  teal: 'badge-teal',
  amber: 'badge-amber',
  red: 'badge-red',
  green: 'badge-green',
};

export default function Badge({ children, variant = 'accent', className = '', icon: Icon }) {
  return (
    <span className={cn('badge', badgeVariants[variant], className)}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}
