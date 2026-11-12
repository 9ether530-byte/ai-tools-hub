import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTICLES, getArticle, wordCount } from '../../../lib/articles';
import AdSlot from '../../../components/AdSlot';

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return { title: `${article.title} — NativeLayer AI Tools Hub`, description: article.description };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const related = article.related.map(getArticle).filter(Boolean);
  return (
    <article>
      <h1>{article.title}</h1>
      <p className="meta">{article.date} · By {article.author} · About {wordCount(article)} words</p>

      {article.intro.map((p, i) => <p key={i}>{p}</p>)}

      <AdSlot label="Ad space — in article" />

      <h2>How to do it</h2>
      {article.steps.map((s, i) => (
        <section key={i}>
          <h3>{i + 1}. {s.title}</h3>
          <p>{s.body}</p>
        </section>
      ))}

      <h2>Common mistakes to avoid</h2>
      {article.pitfalls.map((p, i) => (
        <section key={i}>
          <h3>{p.title}</h3>
          <p>{p.body}</p>
        </section>
      ))}

      {article.productLink && (
        <aside className="product-note">
          <p>
            <strong>From NativeLayer:</strong> our Course &amp; Notion Stack ($79) — workbooks and
            Notion templates for organising your business systems:{' '}
            <a href="https://rocdaddy.gumroad.com/l/btwoa">Course &amp; Notion Stack on Gumroad</a>.
          </p>
        </aside>
      )}

      <h2>Frequently asked questions</h2>
      {article.faq.map((f, i) => (
        <section key={i}>
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </section>
      ))}

      <AdSlot label="Ad space — after article" />

      <h2>Related guides</h2>
      <ul>
        {related.map((r) => (
          <li key={r.slug}><Link href={`/articles/${r.slug}`}>{r.title}</Link></li>
        ))}
      </ul>
      <p><Link href="/articles">← All articles</Link></p>
    </article>
  );
}
