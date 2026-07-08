// Non-repeating question engine.
//
// Use `createQuizDeck` when you have a finite pool of items and want to serve
// each one exactly once before any repeats. Use `nextUniqueQuestion` for
// generated questions (e.g. arithmetic) where you want to avoid the last N
// keys being repeated.

export function shuffle<T>(items: readonly T[]): T[] {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function createQuizDeck<T>(pool: readonly T[]) {
  if (pool.length === 0) throw new Error("createQuizDeck: empty pool");
  let deck = shuffle(pool);
  return {
    next(): T {
      if (deck.length === 0) deck = shuffle(pool);
      return deck.pop() as T;
    },
    remaining: () => deck.length,
    reset() { deck = shuffle(pool); },
  };
}

/**
 * Draw a fresh question that hasn't been seen in the last `historySize`
 * generations. `generate` should produce a candidate and a stable key that
 * identifies it.
 */
export function makeUniqueGenerator<T>(
  generate: () => { key: string; value: T },
  historySize = 12,
) {
  const history: string[] = [];
  return () => {
    for (let i = 0; i < 40; i++) {
      const candidate = generate();
      if (!history.includes(candidate.key)) {
        history.push(candidate.key);
        if (history.length > historySize) history.shift();
        return candidate.value;
      }
    }
    // Give up avoiding repeats after many tries; still record it.
    const fallback = generate();
    history.push(fallback.key);
    if (history.length > historySize) history.shift();
    return fallback.value;
  };
}

/** Pick `n` unique random items from a pool, optionally excluding some. */
/**
 * Cross-session unique generator. History is persisted in localStorage so a
 * user reopening the app doesn't see the same questions immediately.
 */
export function makePersistentUniqueGenerator<T>(
  storageKey: string,
  generate: () => { key: string; value: T },
  historySize = 40,
) {
  const load = (): string[] => {
    try {
      if (typeof localStorage === "undefined") return [];
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.slice(-historySize) : [];
    } catch { return []; }
  };
  const save = (h: string[]) => {
    try {
      if (typeof localStorage === "undefined") return;
      localStorage.setItem(storageKey, JSON.stringify(h.slice(-historySize)));
    } catch { /* ignore */ }
  };
  let history = load();
  return () => {
    for (let i = 0; i < 60; i++) {
      const c = generate();
      if (!history.includes(c.key)) {
        history.push(c.key);
        if (history.length > historySize) history = history.slice(-historySize);
        save(history);
        return c.value;
      }
    }
    const fb = generate();
    history.push(fb.key);
    if (history.length > historySize) history = history.slice(-historySize);
    save(history);
    return fb.value;
  };
}

/** Persistent deck: never repeats an item until every item has been served. */
export function createPersistentQuizDeck<T>(
  storageKey: string,
  pool: readonly T[],
  keyOf: (item: T) => string,
) {
  if (pool.length === 0) throw new Error("createPersistentQuizDeck: empty pool");
  const load = (): string[] => {
    try {
      if (typeof localStorage === "undefined") return [];
      const raw = localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch { return []; }
  };
  const save = (seen: string[]) => {
    try {
      if (typeof localStorage === "undefined") return;
      localStorage.setItem(storageKey, JSON.stringify(seen));
    } catch { /* ignore */ }
  };
  let seen = load();
  return {
    next(): T {
      const remaining = pool.filter((p) => !seen.includes(keyOf(p)));
      const source = remaining.length ? remaining : (seen = [], pool.slice());
      const item = source[Math.floor(Math.random() * source.length)];
      seen.push(keyOf(item));
      save(seen);
      return item;
    },
  };
}

export function sampleUnique<T>(
  pool: readonly T[],
  n: number,
  exclude: readonly T[] = [],
): T[] {
  const available = pool.filter((x) => !exclude.includes(x));
  return shuffle(available).slice(0, Math.min(n, available.length));
}