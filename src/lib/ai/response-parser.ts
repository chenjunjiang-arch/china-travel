import { Itinerary } from '@/types/itinerary';

export function parseItineraryResponse(text: string): Itinerary | null {
  // Try 1: parse the full text as JSON directly
  try {
    const parsed = JSON.parse(text);
    if (isValidItinerary(parsed)) return parsed;
  } catch {
    // continue to next strategy
  }

  // Try 2: extract JSON from markdown code blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1].trim());
      if (isValidItinerary(parsed)) return parsed;
    } catch {
      // continue to next strategy
    }
  }

  // Try 3: find the first { and last } and try parsing that
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      const jsonStr = text.slice(firstBrace, lastBrace + 1);
      const parsed = JSON.parse(jsonStr);
      if (isValidItinerary(parsed)) return parsed;
    } catch {
      // all strategies failed
    }
  }

  return null;
}

function isValidItinerary(obj: unknown): obj is Itinerary {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.province === 'string' &&
    typeof o.totalDays === 'number' &&
    typeof o.summary === 'string' &&
    Array.isArray(o.days) &&
    Array.isArray(o.tips)
  );
}

export function createSSEParser(): {
  feed: (chunk: string) => void;
  getText: () => string;
} {
  let accumulated = '';
  let buffer = '';

  return {
    feed(chunk: string) {
      buffer += chunk;

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed || !trimmed.startsWith('data: ')) continue;

        const data = trimmed.slice(6);

        if (data === '[DONE]') continue;

        accumulated += data;
      }
    },

    getText(): string {
      return accumulated;
    },
  };
}
