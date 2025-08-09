import Parser from 'rss-parser';
import { RawItem, normalizeText, parseDate } from '../lib/normalize';

const parser = new Parser<{ 'content:encoded'?: string; content?: string; isoDate?: string }>({
  customFields: {
    item: ['content:encoded'],
  },
  headers: {
    'User-Agent': 'GuidlyIngest/1.0 (+https://guidly.app)',
  },
});

export async function fetchNNG(max: number): Promise<RawItem[]> {
  const feedUrl = 'https://www.nngroup.com/articles/feed/';
  const feed = await parser.parseURL(feedUrl);
  const items = (feed.items ?? []).slice(0, max).map((it): RawItem => {
    const content = it['content:encoded'] ?? it.content ?? '';
    return {
      title: it.title ?? '',
      url: it.link ?? '',
      content: normalizeText(content),
      source: 'NNG',
      publishedAt: parseDate(it.isoDate ?? undefined) ?? null,
      tags: ['NNG'],
    };
  });
  return items.filter((i) => i.title && i.url);
}


