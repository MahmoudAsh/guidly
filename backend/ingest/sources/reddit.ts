import { fetch } from 'undici';
import { RawItem, normalizeText } from '../lib/normalize';

type RedditListing = {
  data: { children: Array<{ data: RedditPost }>; after?: string | null };
};

type RedditPost = {
  title: string;
  permalink: string;
  url: string;
  over_18: boolean;
  stickied: boolean;
  selftext?: string;
  created_utc?: number; // seconds
  subreddit?: string;
};

export async function fetchReddit(subs: string[], max: number): Promise<RawItem[]> {
  const results: RawItem[] = [];
  for (const sub of subs) {
    try {
      const endpoint = `https://www.reddit.com/r/${encodeURIComponent(sub)}/top.json?t=week&limit=25`;
      const res = await fetch(endpoint, {
        headers: {
          'User-Agent': 'GuidlyIngest/1.0 (+https://guidly.app)'
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as RedditListing;
      const items = (json.data?.children ?? [])
        .map((c) => c.data)
        .filter((p) => !p.over_18 && !p.stickied)
        .slice(0, max)
        .map<RawItem>((p) => ({
          title: p.title ?? '',
          url: `https://www.reddit.com${p.permalink ?? ''}`,
          content: normalizeText(p.selftext ?? ''),
          summary: undefined,
          source: 'Reddit',
          publishedAt: p.created_utc ? new Date(p.created_utc * 1000) : null,
          tags: [sub, 'Reddit'],
        }));
      results.push(...items.filter((i) => i.title && i.url));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`[Reddit] Failed for r/${sub}`, err);
    }
  }
  return results;
}


