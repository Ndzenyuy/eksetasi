import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { loginSchema } from '@/lib/validations/auth';
import { validateRequest } from '@/lib/validations/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = validateRequest(loginSchema, body);
    if (!validation.success) {
      return validation.error;
    }

    const { email, password } = validation.data;

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session token
    const sessionToken = await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Determine redirect URL based on role
    let redirectUrl = '/dashboard'; // Default for students
    if (user.role === 'ADMIN') {
      redirectUrl = '/admin';
    } else if (user.role === 'TEACHER') {
      redirectUrl = '/teacher/dashboard';
    }

    // Create response
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        redirectUrl,
      },
      { status: 200 }
    );

    // Set session cookie
    response.cookies.set('session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
