/**
 * useDebouncedValue - Custom hook for debouncing values
 * Following .cursorrules: UI logic separation, <100 lines, reusable, single responsibility
 */

import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a value
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns The debounced value
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout on value change or unmount
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
}
