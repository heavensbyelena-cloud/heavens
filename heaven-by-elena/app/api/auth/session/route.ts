import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, COOKIE_NAME } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { authenticated: false, role: null, email: null },
        { status: 200 }
      );
    }

    const payload = await verifySessionToken(token);
    if (!payload) {
      return NextResponse.json(
        { authenticated: false, role: null, email: null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        role: payload.role,
        email: payload.email ?? null,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { authenticated: false, role: null, email: null },
      { status: 200 }
    );
  }
}

