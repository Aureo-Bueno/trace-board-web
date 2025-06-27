import { useEffect, useState } from 'react';

/**
 * useDebounce - Custom hook para debouncing de valores
 * @param value Valor a ser debounced
 * @param delay Delay em ms
 * @returns Valor debounced
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
