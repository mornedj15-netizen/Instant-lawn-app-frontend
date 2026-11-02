export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

// South African numbers: 0821234567 or +27821234567 (spaces are ignored)
export const isValidPhone = (phone: string): boolean =>
  /^(\+27|0)[0-9]{9}$/.test(phone.replace(/\s/g, ''));