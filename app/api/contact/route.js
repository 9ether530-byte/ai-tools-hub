import { NextResponse } from 'next/server';
import { appendSubmission } from '../../../lib/store';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) {
    return NextResponse.json({ error: 'Name, a valid email, and a message are required.' }, { status: 400 });
  }
  // Phase 1: stored locally only. No email is sent.
  // On read-only hosting (e.g. Vercel) the write fails soft and the
  // response says so instead of 500ing.
  const result = appendSubmission('contact', { name, email, message });
  return NextResponse.json({ ok: true, stored: result.stored });
}
