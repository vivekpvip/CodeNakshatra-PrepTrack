import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

const TEMPLATES = {
  welcome: ({ name }) => ({
    subject: 'Welcome to PrepTrack 🎯',
    html: `
      <div style="font-family:Sora,sans-serif;background:#0c0e14;color:#e8eaf0;padding:40px;border-radius:16px;max-width:560px;margin:auto;">
        <h1 style="color:#6c63ff;font-size:28px;margin:0 0 16px;">Welcome, ${name || 'Aspirant'}!</h1>
        <p style="line-height:1.6;color:#9096b0;">You just unlocked your competitive exam command center.</p>
        <h3 style="color:#00d4aa;margin-top:32px;">Next steps:</h3>
        <ol style="line-height:1.8;color:#e8eaf0;">
          <li>Set your exam date in Settings</li>
          <li>Mark your first 5 syllabus topics</li>
          <li>Ask your AI Coach for a weekly plan</li>
        </ol>
        <p style="margin-top:32px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard"
             style="background:#6c63ff;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
            Open Dashboard
          </a>
        </p>
      </div>
    `,
  }),
  'weekly-digest': ({ name, streak, completion, testsCount }) => ({
    subject: `Your PrepTrack week — ${streak}-day streak 🔥`,
    html: `
      <div style="font-family:Sora,sans-serif;background:#0c0e14;color:#e8eaf0;padding:40px;border-radius:16px;max-width:560px;margin:auto;">
        <h1 style="color:#6c63ff;">Your week, ${name || 'aspirant'}</h1>
        <p>Streak: <strong style="color:#ffd166;">${streak} days</strong></p>
        <p>Syllabus completion: <strong style="color:#00d4aa;">${completion}%</strong></p>
        <p>Tests logged: <strong>${testsCount}</strong></p>
        <p style="margin-top:24px;color:#9096b0;">Keep showing up. Compound interest is real for studying too.</p>
      </div>
    `,
  }),
  'contact-form': ({ name, email, examType, subject, message }) => ({
    subject: `[PrepTrack contact] ${subject}`,
    html: `
      <div style="font-family:sans-serif;">
        <h2>New contact form submission</h2>
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Exam:</strong> ${examType || 'not specified'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr/>
        <p style="white-space:pre-wrap;">${message}</p>
      </div>
    `,
  }),
};

export async function POST(req) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL || 'noreply@preptrack.in';
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Email not configured. Set RESEND_API_KEY.' },
        { status: 503 }
      );
    }

    const { template, payload = {}, to: explicitTo } = await req.json();
    if (!template || !TEMPLATES[template]) {
      return NextResponse.json({ error: 'Invalid template' }, { status: 400 });
    }

    let to = explicitTo;

    if (template === 'contact-form') {
      to = process.env.RESEND_TO_ADMIN_EMAIL || from;
    } else if (!to) {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      to = user.email;
    }

    const { subject, html } = TEMPLATES[template](payload);
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({ from, to, subject, html });

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, id: result.data?.id });
  } catch (error) {
    console.error('Email API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
