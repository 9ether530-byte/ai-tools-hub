import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'NativeLayer AI Tools Hub — Practical AI Guides for Small Business',
  description: 'Plain, practical how-to guides for small business owners using AI: email, invoicing, customer replies, content planning, and more.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link href="/" className="brand">NativeLayer AI Tools Hub</Link>
          <nav>
            <Link href="/articles">Articles</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p>NativeLayer — Gilmer, Texas. Practical AI guides for small business owners.</p>
          <p>
            <Link href="/privacy">Privacy</Link> · <Link href="/disclosure">Disclosure</Link> · <Link href="/rss.xml">RSS</Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
