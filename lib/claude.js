import { GoogleGenerativeAI } from '@google/generative-ai';

let client = null;

export function getGeminiClient() {
  if (!client) {
    // You can also fallback to ANTHROPIC_API_KEY if they just want to rename the variable in .env
    const apiKey = process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.warn('Missing GEMINI_API_KEY environment variable');
      return null;
    }
    client = new GoogleGenerativeAI(apiKey);
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
 * Stream a chat response using Gemini but mock the Anthropic stream interface.
 */
export async function streamCoachResponse(messages, systemPrompt) {
  const genAI = getGeminiClient();
  if (!genAI) {
    throw new Error('Gemini API not configured');
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-flash-latest',
    systemInstruction: systemPrompt,
  });

  const validMessages = messages.filter(m => m.content && m.content.trim() !== '');

  // Map to Gemini history format
  const history = validMessages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const lastMessage = validMessages[validMessages.length - 1];

  const chat = model.startChat({
    history: history,
  });

  const result = await chat.sendMessageStream(lastMessage.content);

  // Return an async generator that mimics Anthropic's stream format
  async function* mockAnthropicStream() {
    for await (const chunk of result.stream) {
      yield {
        type: 'content_block_delta',
        delta: { text: chunk.text() }
      };
    }
  }

  return mockAnthropicStream();
}

/**
 * Generate a structured weekly study plan using Gemini.
 */
export async function generateWeeklyPlan(userData) {
  const genAI = getGeminiClient();
  if (!genAI) {
    throw new Error('Gemini API not configured');
  }

  const systemPrompt = buildCoachSystemPrompt(userData);

  const model = genAI.getGenerativeModel({
    model: 'gemini-flash-latest',
    systemInstruction: systemPrompt + `\n\nIMPORTANT: Respond ONLY with valid JSON array. Each element should be:
{ "day": "Monday", "topics": ["topic1", "topic2"], "hours": 4, "focus": "Brief focus description" }
Return exactly 7 elements, one for each day of the week starting from tomorrow.`,
  });

  const response = await model.generateContent('Generate my personalized weekly study plan based on my current progress. Focus on weak areas and topics not yet started.');
  const text = response.response.text();
  
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
