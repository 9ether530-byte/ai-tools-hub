import { NextResponse } from 'next/server';
import { appendSubmission } from '../../../lib/store';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
  }
  // Phase 1: stored locally only. No email is sent.
  // On read-only hosting (e.g. Vercel) the write fails soft and the
  // response says so instead of 500ing.
  const result = appendSubmission('newsletter', { email });
  return NextResponse.json({ ok: true, stored: result.stored });
}
