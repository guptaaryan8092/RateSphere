import { useState, useEffect } from 'react';

/**
 * Returns a debounced version of `value` after `delay` ms.
 * @param {any} value
 * @param {number} delay - milliseconds (default 400)
 */
const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

export default useDebounce;
