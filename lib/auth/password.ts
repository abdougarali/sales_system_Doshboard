/**
 * Simple password verification using environment variable
 * The admin password is stored in .env.local as ADMIN_PASSWORD
 */

/**
 * Verify the password against the environment variable
 */
export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD not set in environment variables');
    return false;
  }
  
  return password === adminPassword;
}

/**
 * Check if admin password is configured
 */
export function isPasswordConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD;
}
