'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from './useUser';

export function usePlanner() {
  const { user } = useUser();
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTargets = useCallback(async (date = null) => {
    if (!user) return;
    try {
      let query = supabase
        .from('daily_targets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      
      if (date) {
        query = query.eq('target_date', date);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTargets(data || []);
    } catch (err) {
      console.error('Error fetching targets:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTargets();
  }, [fetchTargets]);

  const addTarget = async (topicId, targetDate = null) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('daily_targets')
        .insert({
          user_id: user.id,
          topic_id: topicId,
          target_date: targetDate || new Date().toISOString().split('T')[0],
        })
        .select()
        .single();
      
      if (error) throw error;
      setTargets(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error adding target:', err);
      throw err;
    }
  };

  const toggleTarget = async (targetId) => {
    if (!user) return;
    try {
      const target = targets.find(t => t.id === targetId);
      if (!target) return;

      const newCompleted = !target.completed;
      const { data, error } = await supabase
        .from('daily_targets')
        .update({
          completed: newCompleted,
          completed_at: newCompleted ? new Date().toISOString() : null,
        })
        .eq('id', targetId)
        .select()
        .single();
      
      if (error) throw error;
      setTargets(prev => prev.map(t => t.id === targetId ? data : t));

      // Award XP for completing a target
      if (newCompleted) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('xp_points')
          .eq('id', user.id)
          .single();
        
        await supabase
          .from('profiles')
          .update({ xp_points: (profile?.xp_points || 0) + 10 })
          .eq('id', user.id);

        // Check if all today's targets are done
        const todayTargets = targets.filter(t => 
          t.target_date === new Date().toISOString().split('T')[0]
        );
        const allDone = todayTargets.every(t => 
          t.id === targetId ? true : t.completed
        );
        
        if (allDone && todayTargets.length > 0) {
          // Bonus 20 XP
          const { data: prof2 } = await supabase
            .from('profiles')
            .select('xp_points')
            .eq('id', user.id)
            .single();
          await supabase
            .from('profiles')
            .update({ xp_points: (prof2?.xp_points || 0) + 20 })
            .eq('id', user.id);
        }
      }

      return data;
    } catch (err) {
      console.error('Error toggling target:', err);
      throw err;
    }
  };

  const deleteTarget = async (targetId) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('daily_targets')
        .delete()
        .eq('id', targetId);
      
      if (error) throw error;
      setTargets(prev => prev.filter(t => t.id !== targetId));
    } catch (err) {
      console.error('Error deleting target:', err);
      throw err;
    }
  };

  const getTodayTargets = () => {
    const today = new Date().toISOString().split('T')[0];
    return targets.filter(t => t.target_date === today);
  };

  const getTargetsByDate = (date) => {
    return targets.filter(t => t.target_date === date);
  };

  return {
    targets,
    loading,
    addTarget,
    toggleTarget,
    deleteTarget,
    getTodayTargets,
    getTargetsByDate,
    refreshTargets: fetchTargets,
  };
}
