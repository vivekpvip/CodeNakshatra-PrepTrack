import Anthropic from '@anthropic-ai/sdk';

let client = null;

export function getClaudeClient() {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.warn('Missing ANTHROPIC_API_KEY environment variable');
      return null;
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

/**
 * Build a rich system prompt for the AI coach with the student's real data.
 */
export function buildCoachSystemPrompt(userData) {
  const {
    exam_type = 'upsc',
    exam_date,
    completion_pct = 0,
    not_started_count = 0,
    in_progress_count = 0,
    revised_count = 0,
    recent_tests = [],
    weak_topics = [],
    streak = 0,
  } = userData;

  const daysRemaining = exam_date
    ? Math.max(0, Math.ceil((new Date(exam_date) - new Date()) / (1000 * 60 * 60 * 24)))
    : 'Not set';

  return `You are PrepTrack AI Coach, a warm, encouraging, and deeply knowledgeable study coach for competitive exam aspirants in India. You have access to the student's real data:

Exam: ${exam_type.toUpperCase()} | Exam Date: ${exam_date || 'Not set'} | Days Remaining: ${daysRemaining}
Syllabus Completion: ${completion_pct}%
Topics Not Started: ${not_started_count}
Topics In Progress: ${in_progress_count}
Topics Revised: ${revised_count}
Recent Tests: ${JSON.stringify(recent_tests.slice(0, 5))}
Weak Topics (accuracy < 60%): ${weak_topics.join(', ') || 'None identified yet'}
Current Streak: ${streak} days

Based on this data, give personalised, specific, actionable advice.
Always be encouraging but honest. Use the student's real data in your responses.
Format responses with clear headings and bullet points for readability.
When suggesting study plans, be specific about topics and time allocations.
If the student hasn't set an exam date, gently remind them to set one.
Keep responses concise but comprehensive — aim for 200-400 words.`;
}

/**
 * Stream a chat response from Claude.
 */
export async function streamCoachResponse(messages, systemPrompt) {
  const claude = getClaudeClient();
  if (!claude) {
    throw new Error('Claude API not configured');
  }

  const stream = await claude.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map(m => ({
      role: m.role,
      content: m.content,
    })),
  });

  return stream;
}

/**
 * Generate a structured weekly study plan.
 */
export async function generateWeeklyPlan(userData) {
  const claude = getClaudeClient();
  if (!claude) {
    throw new Error('Claude API not configured');
  }

  const systemPrompt = buildCoachSystemPrompt(userData);

  const response = await claude.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: systemPrompt + `\n\nIMPORTANT: Respond ONLY with valid JSON array. Each element should be:
{ "day": "Monday", "topics": ["topic1", "topic2"], "hours": 4, "focus": "Brief focus description" }
Return exactly 7 elements, one for each day of the week starting from tomorrow.`,
    messages: [{
      role: 'user',
      content: 'Generate my personalized weekly study plan based on my current progress. Focus on weak areas and topics not yet started.',
    }],
  });

  const text = response.content[0].text;
  
  // Try to parse JSON from response
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch {
    // Return a structured fallback
    return [
      { day: 'Monday', topics: ['Review weak areas'], hours: 4, focus: 'Foundation building' },
      { day: 'Tuesday', topics: ['New topics'], hours: 5, focus: 'Expanding coverage' },
      { day: 'Wednesday', topics: ['Practice tests'], hours: 3, focus: 'Application' },
      { day: 'Thursday', topics: ['Deep study'], hours: 5, focus: 'Complex topics' },
      { day: 'Friday', topics: ['Revision'], hours: 4, focus: 'Reinforcement' },
      { day: 'Saturday', topics: ['Mock test'], hours: 3, focus: 'Assessment' },
      { day: 'Sunday', topics: ['Light review'], hours: 2, focus: 'Rest & review' },
    ];
  }
}
