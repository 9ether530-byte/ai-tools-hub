import { ARTICLES, SITE_URL } from '../lib/articles';

export default function sitemap() {
  const base = SITE_URL;
  const pages = ['', '/articles', '/about', '/contact', '/privacy', '/disclosure'].map((p) => ({
    url: `${base}${p || '/'}`,
    lastModified: '2026-11-12',
  }));
  const articles = ARTICLES.map((a) => ({
    url: `${base}/articles/${a.slug}`,
    lastModified: a.date,
  }));
  return [...pages, ...articles];
}
