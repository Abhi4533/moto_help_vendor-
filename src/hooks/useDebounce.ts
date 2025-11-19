import { useEffect, useRef, useState } from 'react';

export const useDebounce = <T>(
  value: T,
  delay: number = 300,
  options: {
    maxWait?: number;
    leading?: boolean;
  } = {},
): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const maxTimeoutRef = useRef<NodeJS.Timeout>(null);
  const isLeadingCalledRef = useRef(false);

  const { maxWait, leading = false } = options;

  useEffect(() => {
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
    }

    // Leading call (execute immediately on first value)
    if (leading && !isLeadingCalledRef.current) {
      setDebouncedValue(value);
      isLeadingCalledRef.current = true;
    } else {
      // Standard debounce
      timeoutRef.current = setTimeout(() => {
        setDebouncedValue(value);
        isLeadingCalledRef.current = false;
      }, delay);
    }

    // Max wait timeout (ensure execution after maximum wait time)
    if (maxWait && maxWait > delay) {
      maxTimeoutRef.current = setTimeout(() => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setDebouncedValue(value);
        isLeadingCalledRef.current = false;
      }, maxWait);
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
      }
    };
  }, [value, delay, maxWait, leading]);

  return debouncedValue;
};

export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300,
): ((...args: Parameters<T>) => void) => {
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};
