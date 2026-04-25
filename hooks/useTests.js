'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from './useUser';

export function useTests() {
  const { user } = useUser();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTests = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', user.id)
        .order('taken_at', { ascending: false });
      
      if (error) throw error;
      setTests(data || []);
    } catch (err) {
      console.error('Error fetching tests:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const addTest = async (testData) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('test_results')
        .insert({
          user_id: user.id,
          ...testData,
        })
        .select()
        .single();
      
      if (error) throw error;
      setTests(prev => [data, ...prev]);

      // Award 15 XP for logging a test
      await supabase
        .from('profiles')
        .select('xp_points')
        .eq('id', user.id)
        .single()
        .then(({ data: profile }) => {
          supabase
            .from('profiles')
            .update({ xp_points: (profile?.xp_points || 0) + 15 })
            .eq('id', user.id)
            .then(() => {});
        });

      return data;
    } catch (err) {
      console.error('Error adding test:', err);
      throw err;
    }
  };

  const deleteTest = async (testId) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('test_results')
        .delete()
        .eq('id', testId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      setTests(prev => prev.filter(t => t.id !== testId));
    } catch (err) {
      console.error('Error deleting test:', err);
      throw err;
    }
  };

  const getAverageScore = () => {
    if (tests.length === 0) return 0;
    const sum = tests.reduce((acc, t) => acc + Number(t.percentage || 0), 0);
    return Math.round(sum / tests.length);
  };

  const getWeakTopics = () => {
    const topicScores = {};
    tests.forEach(test => {
      if (test.topic_tags) {
        test.topic_tags.forEach(tag => {
          if (!topicScores[tag]) topicScores[tag] = { total: 0, count: 0 };
          topicScores[tag].total += Number(test.percentage || 0);
          topicScores[tag].count++;
        });
      }
    });

    return Object.entries(topicScores)
      .map(([topic, { total, count }]) => ({
        topic,
        avgScore: Math.round(total / count),
        testCount: count,
      }))
      .filter(t => t.avgScore < 60)
      .sort((a, b) => a.avgScore - b.avgScore);
  };

  const getRecentTests = (limit = 5) => {
    return tests.slice(0, limit);
  };

  return {
    tests,
    loading,
    addTest,
    deleteTest,
    getAverageScore,
    getWeakTopics,
    getRecentTests,
    refreshTests: fetchTests,
  };
}
