import confetti from 'canvas-confetti';
import { getLevel } from './utils';

/**
 * Centralized XP rewards. Reasons map to a numeric amount.
 * Use these constants instead of magic numbers in hooks.
 */
export const XP_REASONS = {
  topic_in_progress: 5,
  topic_revised: 10,
  daily_complete_all: 20,
  test_logged: 15,
  coach_question: 2,
  topic_notes_added: 3,
};

export function xpFor(reason) {
  return XP_REASONS[reason] || 0;
}

/**
 * Award XP to a user. Reads current xp_points, adds the reward, writes back.
 * Returns { newXP, oldLevel, newLevel, leveledUp }.
 *
 * Pass the same `supabase` client the caller already uses (browser client
 * for client hooks; SSR client for routes).
 */
export async function awardXP(supabase, userId, reason) {
  const amount = xpFor(reason);
  if (!amount || !userId) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp_points')
    .eq('id', userId)
    .single();

  const oldXP = profile?.xp_points || 0;
  const newXP = oldXP + amount;

  await supabase.from('profiles').update({ xp_points: newXP }).eq('id', userId);

  const oldLevel = getLevel(oldXP);
  const newLevel = getLevel(newXP);
  const leveledUp = newLevel.level > oldLevel.level;

  return { newXP, oldXP, oldLevel, newLevel, leveledUp, amount };
}

/**
 * Fire a small confetti burst from a point on the screen.
 * Used for level-ups and other celebration moments.
 */
export function celebrate({ duration = 1800, colors } = {}) {
  if (typeof window === 'undefined') return;

  const defaults = {
    spread: 80,
    ticks: 60,
    gravity: 0.9,
    decay: 0.92,
    startVelocity: 35,
    colors: colors || ['#6c63ff', '#00d4aa', '#ffd166', '#06d6a0'],
  };

  const end = Date.now() + duration;
  (function frame() {
    confetti({
      ...defaults,
      particleCount: 6,
      origin: { x: Math.random(), y: Math.random() * 0.4 + 0.1 },
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
