import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { findTopic } from '@/lib/syllabus';

export const dynamic = 'force-dynamic';

/**
 * POST /api/reminder
 * Body (optional): { test: true } to send immediately to caller's phone for testing.
 * Otherwise sends today's targets to the authed user's phone.
 */
export async function POST(req) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_PHONE_NUMBER;
    if (!sid || !token || !from) {
      return NextResponse.json(
        { error: 'SMS not configured. Set TWILIO_* env vars.' },
        { status: 503 }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, phone, exam_type')
      .eq('id', user.id)
      .single();

    if (!profile?.phone) {
      return NextResponse.json(
        { error: 'No phone number on profile. Set one in Settings.' },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().split('T')[0];
    const { data: targets = [] } = await supabase
      .from('daily_targets')
      .select('topic_id, completed')
      .eq('user_id', user.id)
      .eq('target_date', today);

    const pending = targets.filter((t) => !t.completed);
    const examType = profile.exam_type || 'upsc';
    const topicNames = pending
      .slice(0, 5)
      .map((t) => findTopic(examType, t.topic_id)?.name || t.topic_id)
      .join('\n• ');

    const body = pending.length
      ? `🎯 PrepTrack — Today's targets, ${profile.full_name?.split(' ')[0] || 'aspirant'}:\n• ${topicNames}\n\nLet's go! 💪`
      : `🌟 PrepTrack — No targets set for today. Open the planner to add some!`;

    // Twilio v6 ESM
    const twilio = (await import('twilio')).default;
    const client = twilio(sid, token);
    const message = await client.messages.create({
      body,
      from,
      to: profile.phone,
    });

    return NextResponse.json({ ok: true, sid: message.sid });
  } catch (error) {
    console.error('Reminder API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
