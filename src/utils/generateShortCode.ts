/**
 * Generates a random short code for URL shortening
 * @param length - Length of the short code (default: 6)
 * @returns Random alphanumeric string
 */
export const generateShortCode = (length: number = 6): string => {
  // Characters to use: A-Z, a-z, 0-9
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortCode = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortCode += characters[randomIndex];
  }

  return shortCode;
};