import { cookies } from 'next/headers';
import { db } from './db';
import * as crypto from 'crypto';

// Verify password
export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

// Hash password
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

// Get current session
export async function getSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('admin_session')?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    // Simple token verification (in production, use proper session management)
    const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8');
    const [email, timestamp] = decoded.split(':');

    // Check if session is not expired (24 hours)
    const sessionTime = parseInt(timestamp);
    if (Date.now() - sessionTime > 24 * 60 * 60 * 1000) {
      return null;
    }

    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, role: true },
    });

    return user;
  } catch {
    return null;
  }
}

// Create session token
export function createSessionToken(email: string): string {
  const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
  return token;
}

// Login function
export async function login(email: string, password: string) {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    return null;
  }

  if (!verifyPassword(password, user.password)) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
