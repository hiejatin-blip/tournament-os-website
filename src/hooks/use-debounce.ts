import { useEffect, useState } from "react";

/**
 * useDebounce — returns the input value after `delay` ms of inactivity.
 * (Cuicui/Mantine hook pattern; needed by the vendored KokonutUI
 * `action-search-bar.tsx` and the global search provider.)
 */
export function useDebounce<T>(value: T, delay = 120): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export default useDebounce;
