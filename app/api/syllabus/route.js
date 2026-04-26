import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/syllabus
 *   Returns the authed user's topic_progress rows.
 *
 * POST /api/syllabus
 *   Body: { topic_id, status?, notes? }
 *   Upserts a topic_progress row for the authed user.
 *
 * DELETE /api/syllabus?topic_id=...
 *   Removes the row for that topic.
 */
async function authed() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { error: 'Unauthorized', status: 401 };
  return { supabase, user };
}

export async function GET() {
  const ctx = await authed();
  if (ctx.error) return NextResponse.json({ error: ctx.error }, { status: ctx.status });

  const { data, error } = await ctx.supabase
    .from('topic_progress')
    .select('*')
    .eq('user_id', ctx.user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req) {
  const ctx = await authed();
  if (ctx.error) return NextResponse.json({ error: ctx.error }, { status: ctx.status });

  const body = await req.json();
  if (!body?.topic_id) {
    return NextResponse.json({ error: 'topic_id required' }, { status: 400 });
  }

  const row = {
    user_id: ctx.user.id,
    topic_id: body.topic_id,
    updated_at: new Date().toISOString(),
  };
  if (body.status) row.status = body.status;
  if (body.notes !== undefined) row.notes = body.notes;

  const { data, error } = await ctx.supabase
    .from('topic_progress')
    .upsert(row, { onConflict: 'user_id,topic_id' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req) {
  const ctx = await authed();
  if (ctx.error) return NextResponse.json({ error: ctx.error }, { status: ctx.status });

  const topicId = new URL(req.url).searchParams.get('topic_id');
  if (!topicId) {
    return NextResponse.json({ error: 'topic_id query param required' }, { status: 400 });
  }

  const { error } = await ctx.supabase
    .from('topic_progress')
    .delete()
    .eq('user_id', ctx.user.id)
    .eq('topic_id', topicId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
