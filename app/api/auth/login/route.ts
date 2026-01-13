import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, isPasswordConfigured } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';

const SESSION_COOKIE_NAME = 'admin_session';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Check if password is configured
    if (!isPasswordConfigured()) {
      return NextResponse.json(
        { error: 'ADMIN_PASSWORD not configured in .env.local' },
        { status: 500 }
      );
    }

    // Verify password against env variable
    const isValid = verifyPassword(password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Create session and set cookie
    const sessionToken = createSession();
    const response = NextResponse.json({ success: true });
    
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
