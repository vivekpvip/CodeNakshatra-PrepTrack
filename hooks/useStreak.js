'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from './useUser';

export function useStreak() {
  const { user, profile } = useUser();
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  const calculateStreak = useCallback(async () => {
    if (!user) return;
    
    try {
      // Fetch study sessions and completed targets to determine activity days
      const { data: sessions } = await supabase
        .from('study_sessions')
        .select('session_date')
        .eq('user_id', user.id)
        .order('session_date', { ascending: false });

      const { data: completedTargets } = await supabase
        .from('daily_targets')
        .select('target_date')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('target_date', { ascending: false });

      // Combine activity dates
      const activeDates = new Set();
      sessions?.forEach(s => activeDates.add(s.session_date));
      completedTargets?.forEach(t => activeDates.add(t.target_date));

      // Calculate current streak
      const sortedDates = [...activeDates].sort((a, b) => new Date(b) - new Date(a));
      let currentStreak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < sortedDates.length; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        
        if (sortedDates.includes(dateStr)) {
          currentStreak++;
        } else if (i === 0) {
          // If today has no activity, check if yesterday was active
          continue;
        } else {
          break;
        }
      }

      setStreak(currentStreak);
      
      // Update profile if streak changed
      const newLongest = Math.max(currentStreak, profile?.longest_streak || 0);
      setLongestStreak(newLongest);

      if (currentStreak !== profile?.streak || newLongest !== profile?.longest_streak) {
        await supabase
          .from('profiles')
          .update({ 
            streak: currentStreak, 
            longest_streak: newLongest 
          })
          .eq('id', user.id);
      }
    } catch (err) {
      console.error('Error calculating streak:', err);
    }
  }, [user, profile]);

  useEffect(() => {
    calculateStreak();
  }, [calculateStreak]);

  return {
    streak: profile?.streak || streak,
    longestStreak: profile?.longest_streak || longestStreak,
    refreshStreak: calculateStreak,
  };
}
