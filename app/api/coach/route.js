import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { streamCoachResponse, buildCoachSystemPrompt } from '@/lib/claude';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    const [profileData, syllabusData, testsData] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('topic_progress').select('*').eq('user_id', user.id),
      supabase.from('test_results').select('*').eq('user_id', user.id).order('taken_at', { ascending: false }).limit(5),
    ]);

    const progress = syllabusData.data || [];
    const notStartedCount = progress.filter((p) => p.status === 'not_started').length;
    const inProgressCount = progress.filter((p) => p.status === 'in_progress').length;
    const revisedCount = progress.filter((p) => p.status === 'revised').length;
    const totalTracked = notStartedCount + inProgressCount + revisedCount;
    const completionPct = totalTracked > 0 ? Math.round((revisedCount / totalTracked) * 100) : 0;

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
      completion_pct: completionPct,
      not_started_count: notStartedCount,
      in_progress_count: inProgressCount,
      revised_count: revisedCount,
      recent_tests: tests,
      weak_topics: weakTopics,
    };

    const systemPrompt = buildCoachSystemPrompt(userData);
    const stream = await streamCoachResponse(messages, systemPrompt);

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = '';
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.text) {
              fullResponse += chunk.delta.text;
              controller.enqueue(new TextEncoder().encode(chunk.delta.text));
            }
          }

          const lastUserMessage = messages[messages.length - 1];
          if (lastUserMessage && lastUserMessage.role === 'user') {
            await supabase.from('coach_messages').insert([
              { user_id: user.id, role: 'user', content: lastUserMessage.content },
              { user_id: user.id, role: 'assistant', content: fullResponse },
            ]);
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Coach API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
