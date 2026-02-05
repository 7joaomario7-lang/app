
/**
 * Obfuscates a hostname using Base64 encoding with a custom prefix.
 * This is not for security, but to hide the value from casual inspection in the UI.
 * @param host The original hostname string.
 * @returns An obfuscated string.
 */
export const encryptHost = (host: string): string => {
  if (!host) return '';
  // Simple Base64 encoding and removing padding for a cleaner look.
  const encoded = btoa(host).replace(/=/g, '');
  return `pmt-key-${encoded}`;
};
