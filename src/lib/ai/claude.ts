import Anthropic from '@anthropic-ai/sdk';

let cached: Anthropic | null = null;
function client() {
  if (!cached) cached = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  return cached;
}

// Use the latest Sonnet 4.6 (not the placeholder "4-7" from the spec).
const MODEL = 'claude-sonnet-4-6';

export interface ChordSuggestion {
  chord: string;
  reason: string;
}

export async function suggestNextChord(
  currentProgression: string[],
  genre: string,
  key: string,
  scale: string,
): Promise<{ suggestions: ChordSuggestion[] }> {
  const message = await client().messages.create({
    model: MODEL,
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `You are a music theory expert. The user is making a ${genre} track in ${key} ${scale}.

Their current chord progression is: ${currentProgression.join(' → ')}

Suggest 3 chords that could come next. For each, explain why it works in this genre and key. Return ONLY valid JSON in this exact format:

{
  "suggestions": [
    {"chord": "Am", "reason": "Brief reason why"},
    {"chord": "F", "reason": "Brief reason why"},
    {"chord": "G", "reason": "Brief reason why"}
  ]
}

No preamble, no markdown, just the JSON.`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  return JSON.parse(text);
}
