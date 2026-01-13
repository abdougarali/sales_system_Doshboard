import { NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'admin_session';

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
