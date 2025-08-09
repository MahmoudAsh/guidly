import { fetch } from 'undici';
import { normalizeText } from './normalize';

export async function summarizeIfNeeded(params: {
  title: string;
  content?: string;
  existingSummary?: string;
}): Promise<string | undefined> {
  const { title, content, existingSummary } = params;
  if (existingSummary && existingSummary.trim().length > 0) return existingSummary;

  const apiKey = process.env.OPENAI_API_KEY;
  const baseText = normalizeText(content ?? '');
  if (!apiKey) {
    const combined = `${title}. ${baseText}`.trim();
    return combined.slice(0, 400);
  }

  const prompt = `Summarize this design article in <= 90 words for a product designer.\n\nTitle: ${title}\n\nContent:\n${baseText}`;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a concise, helpful assistant for product designers.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 300,
      }),
    });
    if (!response.ok) {
      return baseText.slice(0, 400);
    }
    const data: any = await response.json();
    const text: string | undefined = data?.choices?.[0]?.message?.content;
    return (text ?? baseText).trim().slice(0, 600);
  } catch {
    return baseText.slice(0, 400);
  }
}


