'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  teal: 'btn-teal',
  danger: 'btn bg-[var(--red)] text-white hover:shadow-[0_0_30px_var(--red-glow)]',
};

const sizes = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

export default function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  onClick,
  type = 'button',
  ...props
}) {
  const cls = cn('btn', variants[variant], sizes[size], className, {
    'opacity-50 cursor-not-allowed': disabled || loading,
  });

  const inner = (
    <>
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : 18} />
      ) : null}
      {children}
    </>
  );

  if (href && !disabled && !loading) {
    return (
      <Link href={href} className={cls} onClick={onClick} {...props}>
        {inner}
      </Link>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      type={type}
      className={cls}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {inner}
    </motion.button>
  );
}
