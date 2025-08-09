type Counters = {
  fetched: number;
  processed: number;
  inserted: number;
  updated: number;
  skipped: number;
  failed: number;
};

export function createLogger(source: string) {
  const counters: Counters = {
    fetched: 0,
    processed: 0,
    inserted: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
  };

  function info(message: string, extra?: unknown) {
    if (extra !== undefined) {
      // eslint-disable-next-line no-console
      console.log(`[${source}] ${message}`, extra);
    } else {
      // eslint-disable-next-line no-console
      console.log(`[${source}] ${message}`);
    }
  }

  function error(message: string, extra?: unknown) {
    if (extra !== undefined) {
      // eslint-disable-next-line no-console
      console.error(`[${source}] ${message}`, extra);
    } else {
      // eslint-disable-next-line no-console
      console.error(`[${source}] ${message}`);
    }
  }

  function increment<K extends keyof Counters>(key: K, by: number = 1) {
    counters[key] += by;
  }

  function report() {
    // eslint-disable-next-line no-console
    console.log(`[${source}] Summary`, counters);
    return counters;
  }

  return { info, error, increment, report, counters };
}


