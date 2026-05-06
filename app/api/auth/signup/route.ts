import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail, getUserByUsername } from '@/lib/db';
import { signToken, setCookieHeader } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, referral_code } = await request.json();

    if (!username || !email || !password) {
      return Response.json({ error: 'All fields required' }, { status: 400 });
    }

    if (username.length < 3 || username.length > 20) {
      return Response.json({ error: 'Username must be 3–20 characters' }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existingEmail = getUserByEmail(email);
    if (existingEmail) {
      return Response.json({ error: 'Email already registered' }, { status: 409 });
    }

    const existingUsername = getUserByUsername(username);
    if (existingUsername) {
      return Response.json({ error: 'Username already taken' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = createUser(username, email, passwordHash, referral_code || undefined);
    const userId = result.lastInsertRowid as number;

    const token = signToken({ userId, username, email });

    return new Response(JSON.stringify({ success: true, username }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': setCookieHeader(token),
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
