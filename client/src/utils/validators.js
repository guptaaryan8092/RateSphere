// ── Validation ────────────────────────────────────────────────────────────────

export const validateName = (name) => {
  if (!name || name.trim().length < 20) return 'Name must be at least 20 characters.';
  if (name.trim().length > 60)         return 'Name must be at most 60 characters.';
  return null;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !re.test(email)) return 'Please enter a valid email address.';
  return null;
};

export const validatePassword = (password) => {
  if (!password || password.length < 8)    return 'Password must be at least 8 characters.';
  if (password.length > 16)                return 'Password must be at most 16 characters.';
  if (!/[A-Z]/.test(password))             return 'Password must contain at least one uppercase letter.';
  if (!/[^A-Za-z0-9]/.test(password))      return 'Password must contain at least one special character.';
  return null;
};

export const validateAddress = (address) => {
  if (address && address.length > 400) return 'Address must be at most 400 characters.';
  return null;
};

export const validateRating = (rating) => {
  const n = Number(rating);
  if (!Number.isInteger(n) || n < 1 || n > 5) return 'Rating must be between 1 and 5.';
  return null;
};
