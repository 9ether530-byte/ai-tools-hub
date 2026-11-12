'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  function update(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  async function submit(e) {
    e.preventDefault();
    setStatus('Sending…');
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? 'Thanks — your message was saved. We reply by email.' : 'Something went wrong. Please try again.');
    if (res.ok) setForm({ name: '', email: '', message: '' });
  }
  return (
    <form onSubmit={submit} className="form">
      <label htmlFor="contact-name">Name</label>
      <input id="contact-name" name="name" required value={form.name} onChange={update} />
      <label htmlFor="contact-email">Email</label>
      <input id="contact-email" name="email" type="email" required value={form.email} onChange={update} />
      <label htmlFor="contact-message">Message</label>
      <textarea id="contact-message" name="message" rows={6} required value={form.message} onChange={update} />
      <button type="submit">Send message</button>
      {status && <p role="status">{status}</p>}
    </form>
  );
}
