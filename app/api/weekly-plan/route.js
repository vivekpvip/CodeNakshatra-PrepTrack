import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { generateWeeklyPlan } from '@/lib/claude';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [profileData, testsData] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('test_results').select('*').eq('user_id', user.id).order('taken_at', { ascending: false }).limit(5),
    ]);

    const tests = testsData.data || [];
    const topicScores = {};
    tests.forEach((test) => {
      if (test.topic_tags) {
        test.topic_tags.forEach((tag) => {
          if (!topicScores[tag]) topicScores[tag] = { total: 0, count: 0 };
          topicScores[tag].total += Number(test.percentage);
          topicScores[tag].count++;
        });
      }
    });
    const weakTopics = Object.entries(topicScores)
      .filter(([, data]) => data.total / data.count < 60)
      .map(([topic]) => topic);

    const userData = {
      ...(profileData.data || {}),
      recent_tests: tests,
      weak_topics: weakTopics,
    };

    const plan = await generateWeeklyPlan(userData);
    return NextResponse.json(plan);
  } catch (error) {
    console.error('Weekly Plan API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
