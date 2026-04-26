/**
 * Format a date string to a readable format.
 * @param {string|Date} date
 */
export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(date));

/**
 * Round a number to 1 decimal place, return '—' if null/undefined.
 */
export const formatRating = (value) =>
  value != null ? Number(value).toFixed(1) : '—';

/**
 * Capitalize first letter of each word.
 */
export const capitalize = (str) =>
  str ? str.replace(/\b\w/g, (c) => c.toUpperCase()) : '';

/**
 * Truncate a string to maxLen, appending '…'.
 */
export const truncate = (str, maxLen = 40) =>
  str && str.length > maxLen ? `${str.slice(0, maxLen)}…` : str;
