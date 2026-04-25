import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx support
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a readable string
 */
export function formatDate(date, options = {}) {
  const d = new Date(date);
  const defaults = { year: 'numeric', month: 'short', day: 'numeric' };
  return d.toLocaleDateString('en-IN', { ...defaults, ...options });
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function timeAgo(date) {
  const now = new Date();
  const d = new Date(date);
  const seconds = Math.floor((now - d) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(date);
}

/**
 * Calculate days remaining until a date
 */
export function daysUntil(date) {
  if (!date) return null;
  const now = new Date();
  const target = new Date(date);
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

/**
 * Calculate percentage
 */
export function percentage(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Format number with commas (Indian style)
 */
export function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  return num.toLocaleString('en-IN');
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text, length = 100) {
  if (!text || text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Generate a random ID
 */
export function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Debounce function
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Get exam display name
 */
export function getExamName(examType) {
  const names = {
    upsc: 'UPSC Civil Services',
    jee: 'JEE Main + Advanced',
    neet: 'NEET UG',
    cat: 'CAT',
    gate: 'GATE',
    state_psc: 'State PSC',
  };
  return names[examType] || examType?.toUpperCase() || 'Unknown';
}

/**
 * Get XP level info
 */
export function getLevel(xp) {
  if (xp >= 5000) return { level: 4, name: 'Champion', color: 'var(--amber)', nextAt: null, icon: '👑' };
  if (xp >= 2000) return { level: 3, name: 'Expert', color: 'var(--teal)', nextAt: 5000, icon: '⚡' };
  if (xp >= 500) return { level: 2, name: 'Scholar', color: 'var(--accent)', nextAt: 2000, icon: '📚' };
  return { level: 1, name: 'Aspirant', color: 'var(--text-secondary)', nextAt: 500, icon: '🌱' };
}

/**
 * Get status color for topic progress
 */
export function getStatusColor(status) {
  switch (status) {
    case 'mastered':
    case 'revised': return 'var(--green)';
    case 'in_progress': return 'var(--amber)';
    case 'not_started': 
    default: return 'var(--text-muted)';
  }
}

/**
 * Get status label
 */
export function getStatusLabel(status) {
  switch (status) {
    case 'revised': return 'Revised';
    case 'in_progress': return 'In Progress';
    case 'not_started':
    default: return 'Not Started';
  }
}
