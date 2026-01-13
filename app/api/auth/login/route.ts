import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, getAdminPasswordHash, initializeAdmin } from '@/lib/auth/password';
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

    // Get admin password hash
    let passwordHash = await getAdminPasswordHash();

    // If no admin exists, initialize with provided password
    if (!passwordHash) {
      await initializeAdmin(password);
      passwordHash = await getAdminPasswordHash();
    }

    if (!passwordHash) {
      return NextResponse.json(
        { error: 'Admin not configured' },
        { status: 500 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, passwordHash);

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
