'use client';
import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  async function submit(e) {
    e.preventDefault();
    setStatus('Saving…');
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setStatus(res.ok ? 'Thanks — you are on the list. No emails are sent yet in Phase 1.' : 'Something went wrong. Please try again.');
    if (res.ok) setEmail('');
  }
  return (
    <form onSubmit={submit} className="form">
      <label htmlFor="newsletter-email">Get one practical AI tip a week</label>
      <input id="newsletter-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yourbusiness.com" />
      <button type="submit">Join the list</button>
      {status && <p role="status">{status}</p>}
    </form>
  );
}
