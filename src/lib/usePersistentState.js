import { useEffect, useState } from 'react';

const isPlainObject = (v) => v != null && typeof v === 'object' && !Array.isArray(v);

/** useState that survives reloads. Falls back to memory-only if storage is blocked. */
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return initial;
      const parsed = JSON.parse(raw);
      // Merge into `initial`'s shape for plain objects, so a field added to the
      // default after a value was already persisted still comes back defined
      // (otherwise a saved settings blob from an older version of the app would
      // be missing newer keys and controlled inputs would start uncontrolled).
      return isPlainObject(parsed) && isPlainObject(initial)
        ? { ...initial, ...parsed }
        : parsed;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* private mode / quota — keep running with in-memory state */
    }
  }, [key, value]);

  return [value, setValue];
}
