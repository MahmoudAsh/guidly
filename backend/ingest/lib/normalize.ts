// Use require to avoid TS ESM typing issues in ts-node
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { htmlToText } = require('html-to-text');
import { parseISO, isValid } from 'date-fns';

export type RawItem = {
  title: string;
  url: string;
  content?: string;
  summary?: string;
  source: 'NNG' | 'Medium' | 'Reddit';
  publishedAt?: Date | null;
  tags?: string[];
};

export function normalizeText(htmlOrText: string): string {
  if (!htmlOrText) return '';
  try {
    const text = htmlToText(htmlOrText, {
      wordwrap: false,
      selectors: [
        { selector: 'a', options: { ignoreHref: true } },
        { selector: 'img', format: 'skip' },
        { selector: 'script', format: 'skip' },
        { selector: 'style', format: 'skip' },
      ],
    });
    return text.replace(/[\r\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
  } catch {
    return String(htmlOrText).trim();
  }
}

export function parseDate(input?: string | number | Date | null): Date | null {
  if (!input) return null;
  try {
    if (input instanceof Date) return isValid(input) ? input : null;
    if (typeof input === 'number') {
      const d = new Date(input);
      return isValid(d) ? d : null;
    }
    const iso = parseISO(String(input));
    if (isValid(iso)) return iso;
    const parsed = new Date(String(input));
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}


