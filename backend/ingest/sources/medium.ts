import Parser from 'rss-parser';
import { RawItem, normalizeText, parseDate } from '../lib/normalize';

const parser = new Parser<{ content?: string; isoDate?: string }>({
  headers: {
    'User-Agent': 'GuidlyIngest/1.0 (+https://guidly.app)',
    Accept: 'application/rss+xml, application/xml;q=0.9, */*;q=0.8',
  },
});

export async function fetchMedium(tags: string[], max: number): Promise<RawItem[]> {
  const results: RawItem[] = [];
  for (const tag of tags) {
    try {
      const url = `https://medium.com/feed/tag/${encodeURIComponent(tag)}`;
      const feed = await parser.parseURL(url);
      const items = (feed.items ?? []).slice(0, max).map((it): RawItem => ({
        title: it.title ?? '',
        url: it.link ?? '',
        content: normalizeText(it.content ?? ''),
        source: 'Medium',
        publishedAt: parseDate(it.isoDate ?? undefined) ?? null,
        tags: [tag, 'Medium'],
      }));
      results.push(...items.filter((i) => i.title && i.url));
    } catch (err) {
      // Continue with other tags
      // eslint-disable-next-line no-console
      console.error(`[Medium] Failed for tag ${tag}`, err);
    }
  }
  return results;
}


