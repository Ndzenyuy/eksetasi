import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/lib/validations/auth';
import { validateRequest } from '@/lib/validations/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = validateRequest(registerSchema, body);
    if (!validation.success) {
      return validation.error;
    }

    const { name, email, password } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'STUDENT', // Default role
      },
    });

    // Create session token
    const sessionToken = await createSession({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

    // Determine redirect URL based on role (new users are typically students)
    let redirectUrl = '/dashboard'; // Default for students
    if (newUser.role === 'ADMIN') {
      redirectUrl = '/admin';
    } else if (newUser.role === 'TEACHER') {
      redirectUrl = '/teacher/dashboard';
    }

    // Create response
    const response = NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
        redirectUrl,
      },
      { status: 201 }
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
    console.error('Registration error:', error);
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
