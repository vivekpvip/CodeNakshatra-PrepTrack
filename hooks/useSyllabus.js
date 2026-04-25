'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from './useUser';

export function useSyllabus() {
  const { user } = useUser();
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('topic_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const progressMap = {};
      data.forEach(item => {
        progressMap[item.topic_id] = item;
      });
      setProgress(progressMap);
    } catch (err) {
      console.error('Error fetching syllabus progress:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const updateTopicStatus = async (topicId, status) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('topic_progress')
        .upsert({
          user_id: user.id,
          topic_id: topicId,
          status,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,topic_id' })
        .select()
        .single();
      
      if (error) throw error;
      
      setProgress(prev => ({
        ...prev,
        [topicId]: data,
      }));

      // Award XP
      if (status === 'in_progress') {
        await addXP(5);
      } else if (status === 'revised') {
        await addXP(10);
      }

      return data;
    } catch (err) {
      console.error('Error updating topic:', err);
      throw err;
    }
  };

  const updateTopicNotes = async (topicId, notes) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('topic_progress')
        .upsert({
          user_id: user.id,
          topic_id: topicId,
          notes,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,topic_id' })
        .select()
        .single();
      
      if (error) throw error;
      setProgress(prev => ({ ...prev, [topicId]: data }));
      return data;
    } catch (err) {
      console.error('Error updating notes:', err);
      throw err;
    }
  };

  const addXP = async (amount) => {
    if (!user) return;
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp_points')
        .eq('id', user.id)
        .single();
      
      await supabase
        .from('profiles')
        .update({ xp_points: (profile?.xp_points || 0) + amount })
        .eq('id', user.id);
    } catch (err) {
      console.error('Error adding XP:', err);
    }
  };

  const getTopicStatus = (topicId) => {
    return progress[topicId]?.status || 'not_started';
  };

  const getTopicNotes = (topicId) => {
    return progress[topicId]?.notes || '';
  };

  const getCompletionStats = (topics) => {
    const total = topics.length;
    let notStarted = 0, inProgress = 0, revised = 0;
    
    topics.forEach(topic => {
      const status = getTopicStatus(topic.id);
      if (status === 'revised') revised++;
      else if (status === 'in_progress') inProgress++;
      else notStarted++;
    });

    return {
      total,
      notStarted,
      inProgress,
      revised,
      completionPercent: total > 0 ? Math.round((revised / total) * 100) : 0,
      progressPercent: total > 0 ? Math.round(((revised + inProgress) / total) * 100) : 0,
    };
  };

  return {
    progress,
    loading,
    updateTopicStatus,
    updateTopicNotes,
    getTopicStatus,
    getTopicNotes,
    getCompletionStats,
    refreshProgress: fetchProgress,
  };
}
