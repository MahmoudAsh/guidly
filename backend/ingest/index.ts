import 'dotenv/config';
// Lightweight concurrency limiter to avoid ESM-only deps
function createLimit(concurrency: number) {
  let activeCount = 0;
  const queue: Array<() => void> = [];

  const next = () => {
    if (activeCount >= concurrency) return;
    const run = queue.shift();
    if (!run) return;
    run();
  };

  return function limit<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const run = () => {
        activeCount++;
        fn()
          .then(resolve, reject)
          .finally(() => {
            activeCount--;
            next();
          });
      };
      queue.push(run);
      // Kick the queue on next tick
      if (queue.length <= concurrency) {
        // Allow a small delay to accumulate microtasks
        setImmediate(next);
      }
    });
  };
}
import { z } from 'zod';
import { getPrismaClient } from './lib/prisma';
import { createLogger } from './lib/log';
import { RawItem } from './lib/normalize';
import { summarizeIfNeeded } from './lib/summarize';
import { fetchNNG } from './sources/nng';
import { fetchMedium } from './sources/medium';
import { fetchReddit } from './sources/reddit';

const prisma = getPrismaClient();
const log = createLogger('Ingest');

const EnvSchema = z.object({
  INGEST_MEDIUM_TAGS: z.string().optional().default('product-design,ux,ui,design-systems'),
  INGEST_REDDIT_SUBS: z.string().optional().default('UserExperience,UI_Design,web_design,Figma'),
  INGEST_MAX_PER_SOURCE: z.string().optional().default('20'),
});

async function collectAll(): Promise<Record<string, RawItem[]>> {
  const env = EnvSchema.parse(process.env);
  const max = Math.max(1, Number(env.INGEST_MAX_PER_SOURCE) || 20);
  const mediumTags = env.INGEST_MEDIUM_TAGS.split(',').map((s) => s.trim()).filter(Boolean);
  const redditSubs = env.INGEST_REDDIT_SUBS.split(',').map((s) => s.trim()).filter(Boolean);

  const [nng, medium, reddit] = await Promise.all([
    fetchNNG(max).then((arr) => arr.slice(0, max)).catch(() => []),
    fetchMedium(mediumTags, max).then((arr) => arr.slice(0, max)).catch(() => []),
    fetchReddit(redditSubs, max).then((arr) => arr.slice(0, max)).catch(() => []),
  ]);

  log.increment('fetched', nng.length + medium.length + reddit.length);
  return { NNG: nng, Medium: medium, Reddit: reddit };
}

async function upsertItems(sourceName: string, items: RawItem[]) {
  const limiter = createLimit(3);
  const writeLimiter = createLimit(5);
  const logger = createLogger(sourceName);

  const tasks = items.map((raw) => limiter(async () => {
    try {
      const summary = await summarizeIfNeeded({ title: raw.title, content: raw.content, existingSummary: raw.summary });
      const data = {
        title: raw.title,
        url: raw.url,
        source: raw.source,
        summary: summary ?? null,
        content: raw.content ?? null,
        tags: raw.tags ?? [],
        publishedAt: raw.publishedAt ?? null,
      };

      logger.increment('processed');

      const result = await writeLimiter(() => prisma.article.upsert({
        where: { url: data.url },
        create: data,
        update: {
          title: data.title,
          source: data.source,
          summary: data.summary,
          content: data.content,
          tags: data.tags,
          publishedAt: data.publishedAt,
        },
      }));

      if (result && result.createdAt && result.updatedAt && result.createdAt.getTime() === result.updatedAt.getTime()) {
        logger.increment('inserted');
      } else {
        logger.increment('updated');
      }
    } catch (err) {
      logger.increment('failed');
      logger.error('Failed to upsert', { url: raw.url, err });
    }
  }));

  await Promise.all(tasks);
  return logger.report();
}

async function main() {
  const groups = await collectAll();

  const reports = await Promise.all([
    upsertItems('NNG', groups.NNG),
    upsertItems('Medium', groups.Medium),
    upsertItems('Reddit', groups.Reddit),
  ]);

  log.info('All sources complete');
  // eslint-disable-next-line no-console
  console.log(reports);
}

main()
  .catch((err) => {
    log.error('Fatal error', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/*
README (quick):

1) Env (.env)
   - DATABASE_URL="postgresql://…(Supabase)…"
   - OPENAI_API_KEY="sk-…(optional)"
   - INGEST_MEDIUM_TAGS="product-design,ux,ui,design-systems"
   - INGEST_REDDIT_SUBS="UserExperience,UI_Design,web_design,Figma"
   - INGEST_MAX_PER_SOURCE="20"

2) Install deps
   - npm install

3) Run
   - npm run ingest

4) Automate (cron)
   - GitHub Action on schedule, or Supabase Scheduled job calling your server endpoint that triggers this script.
*/


