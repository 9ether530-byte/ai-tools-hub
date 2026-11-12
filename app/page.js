import Link from 'next/link';
import { ARTICLES } from '../lib/articles';
import AdSlot from '../components/AdSlot';
import NewsletterForm from '../components/NewsletterForm';

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Practical AI guides for small business owners</h1>
        <p>
          No hype, no income promises. Short, plain guides to using AI for the everyday work
          of a small business: email, invoicing, customer replies, content, meetings, and bookkeeping.
          Written by NativeLayer, Gilmer, Texas.
        </p>
      </section>

      <AdSlot label="Ad space — top" />

      <section>
        <h2>Latest guides</h2>
        <ul className="article-list">
          {ARTICLES.map((a) => (
            <li key={a.slug}>
              <h3><Link href={`/articles/${a.slug}`}>{a.title}</Link></h3>
              <p>{a.description}</p>
              <p className="meta">{a.date} · {a.author}</p>
            </li>
          ))}
        </ul>
        <p><Link href="/articles">Browse all articles →</Link></p>
      </section>

      <section className="product-note">
        <h2>From NativeLayer</h2>
        <p>
          Our Course &amp; Notion Stack ($79) is a set of workbooks and Notion templates for
          organising a small business — useful alongside the planning guides on this site:{' '}
          <a href="https://rocdaddy.gumroad.com/l/btwoa">Course &amp; Notion Stack on Gumroad</a>.
        </p>
      </section>

      <section>
        <h2>Stay in the loop</h2>
        <NewsletterForm />
      </section>
    </>
  );
}
