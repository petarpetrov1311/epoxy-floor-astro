import type { APIRoute } from 'astro';
import { floorRegistry } from '../lib/floor-content.mjs';
import { SITE } from '../lib/floor-seo.mjs';
import { publishedProjects } from '../lib/projects.mjs';
export const prerender = true;
const escapeXml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
export const GET: APIRoute = () => {
  const entries = floorRegistry.filter(entry => !entry.data.noindex && !entry.data.draft).map(entry => ({ url: entry.url, modified: entry.data.updatedDate || entry.data.dateModified || (entry.id.startsWith('blog/') ? entry.data.pubDate : undefined) }));
  for (const url of ['/blog', '/nastilki', '/kontakti', '/galeria']) entries.push({ url, modified: undefined });
  entries.push({ url: '/proekti', modified: undefined });
  for (const project of publishedProjects.filter(({ data }) => !data.noindex)) entries.push({ url: project.url, modified: project.data.pubDate });
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.map(entry => `<url><loc>${escapeXml(SITE + (entry.url === '/' ? '/' : entry.url))}</loc>${entry.modified ? `<lastmod>${new Date(entry.modified).toISOString().slice(0,10)}</lastmod>` : ''}</url>`).join('')}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
