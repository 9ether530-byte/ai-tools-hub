import Link from 'next/link';
import { ARTICLES } from '../../lib/articles';

export const metadata = { title: 'All Articles — NativeLayer AI Tools Hub' };

export default function ArticlesPage() {
  return (
    <>
      <h1>All articles</h1>
      <p>Twelve practical guides for small business owners using AI — no hype, no income promises.</p>
      <ul className="article-list">
        {ARTICLES.map((a) => (
          <li key={a.slug}>
            <h2><Link href={`/articles/${a.slug}`}>{a.title}</Link></h2>
            <p>{a.description}</p>
            <p className="meta">{a.date} · {a.author}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
