import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-secret-key-change-in-production';

/**
 * Create a session cookie after successful login
 */
export function createSession(): string {
  // Simple session token (in production, use JWT or proper session management)
  const sessionToken = Buffer.from(`${Date.now()}-${SESSION_SECRET}`).toString('base64');
  return sessionToken;
}

/**
 * Verify if session is valid
 */
export function verifySession(sessionToken: string | undefined): boolean {
  if (!sessionToken) return false;
  
  try {
    // Decode and verify session token
    const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8');
    const [timestamp, secret] = decoded.split('-');
    
    // Verify secret matches
    if (secret !== SESSION_SECRET) return false;
    
    // Check if session is not too old (24 hours)
    const sessionAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    return sessionAge < maxAge;
  } catch {
    return false;
  }
}

/**
 * Get session from cookies (server-side)
 */
export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value || null;
}

/**
 * Check if user is authenticated (server-side)
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return verifySession(session || undefined);
}

/**
 * Set session cookie (server-side)
 */
export async function setSession(sessionToken: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/',
  });
}

/**
 * Clear session cookie (server-side)
 */
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Get session from request (middleware)
 */
export function getSessionFromRequest(request: NextRequest): string | null {
  const session = request.cookies.get(SESSION_COOKIE_NAME);
  return session?.value || null;
}
