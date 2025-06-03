import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const key = new TextEncoder().encode(secretKey);

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role?: string;
  expiresAt: Date;
}

// Create a new session token
export async function createSession(payload: Omit<SessionPayload, 'expiresAt'>) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  const session = await new SignJWT({ ...payload, expiresAt })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(key);

  return session;
}

// Verify and decode a session token
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });

    // Validate that the payload has the required properties
    if (
      typeof payload.userId === 'string' &&
      typeof payload.email === 'string' &&
      typeof payload.name === 'string' &&
      payload.expiresAt
    ) {
      return payload as unknown as SessionPayload;
    }

    return null;
  } catch (error) {
    console.error('Failed to verify session:', error);
    return null;
  }
}

// Get the current session from cookies
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session-token')?.value;

  if (!token) {
    return null;
  }

  return await verifySession(token);
}

// Set session cookie
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set('session-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

// Delete session cookie
export async function deleteSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.delete('session-token');
}

// Refresh session (extend expiration)
export async function refreshSession(token: string) {
  const session = await verifySession(token);
  
  if (!session) {
    return null;
  }

  // Create a new token with extended expiration
  const newToken = await createSession({
    userId: session.userId,
    email: session.email,
    name: session.name,
    role: session.role,
  });

  return newToken;
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null && new Date(session.expiresAt) > new Date();
}

// Get user info from session
export async function getCurrentUser() {
  const session = await getSession();
  
  if (!session || new Date(session.expiresAt) <= new Date()) {
    return null;
  }

  return {
    id: session.userId,
    email: session.email,
    name: session.name,
    role: session.role || 'user',
  };
}
