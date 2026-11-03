import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { services } from '../src/data/services.js';
import { publishedProjects } from '../src/lib/projects.mjs';

// Run after the production build. These checks inspect HTML before any JS runs.
const read = path => readFileSync(join('dist', path), 'utf8');
const home = read('index.html');
const escapeHtml = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
for (const file of readdirSync('handoff/content/nastilki').filter(file => file.endsWith('.md'))) {
  const source = readFileSync(join('handoff/content/nastilki', file), 'utf8');
  const id = file.replace('.md', '');
  const slug = source.match(/^slug: (.+)$/m)[1].trim();
  for (const route of new Set([id, slug])) {
    const html = read(`nastilki/${route}/index.html`);
    assert(!html.includes('<astro-island'), `${route} must render without React hydration`);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${route} must have one h1`);
    const faqCount = [...source.matchAll(/^  - q: /gm)].length;
    assert.equal((html.match(/<details class="home-faq"/g) || []).length, faqCount, `${route} must prerender all FAQs`);
    for (const [, heading] of source.matchAll(/^#{2,3} (.+)$/gm)) assert(html.includes(escapeHtml(heading.trim())), `${route} missing Markdown heading ${heading}`);
  }
  assert(home.includes(`href="/nastilki/${slug}"`), `${slug} missing from homepage navigation`);
}
for (const [slug, faqCount] of [['za-nas', 4], ['tsena-nastilki', 5], ['tehnologia-i-materiali', 4], ['sravneniya', 3]]) {
  const html = read(`${slug}/index.html`);
  assert(!html.includes('<astro-island'), `${slug} must render without React hydration`);
  assert.equal((html.match(/<details class="home-faq"/g) || []).length, faqCount, `${slug} must prerender every FAQ`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${slug} must have one main heading`);
  const article = html.match(/<article\b[\s\S]*?<\/article>/)?.[0];
  assert(article?.includes('<h2'), `${slug} must include its Markdown body in initial HTML`);
}
const epoxy = read('nastilki/epoksidni/index.html');
assert(!epoxy.includes('<astro-island'), 'Epoxy flooring content must render without React hydration');
assert.equal((epoxy.match(/<details class="home-faq"/g) || []).length, 7, 'All seven epoxy FAQs must be prerendered');
assert(epoxy.includes('<table>') && epoxy.includes('6–12 mm'), 'Technical comparison must be present in initial HTML');
const islands = [...home.matchAll(/<astro-island\b[^>]*component-url="([^"]+)"/g)].map(match => match[1]);
assert.equal(islands.length, 1, 'Only the quote form should hydrate');
for (const name of ['QuoteForm']) {
  assert(islands.some(url => url.includes(name)), `${name} island is missing`);
}
for (const value of ['20+ години', '280 000 кв.м', '1 500 обекта', 'Немски и холандски материали', 'Гаранция 5 години по договор']) {
  const stats = home.match(/<section id="stats"[\s\S]*?<\/section>/)?.[0];
  assert(stats?.includes(value), `Final statistic ${value} must exist before hydration`);
}
const renderedCounters = [...home.matchAll(/<span class="stats-value"[^>]*data-target="(\d+)"[^>]*>(.*?)<\/span>/g)];
assert.equal(renderedCounters.length, 4, 'All numeric statistics must be present in initial HTML');
assert.deepEqual(renderedCounters.map(([, target]) => Number(target)), [20, 280000, 1500, 5], 'SSR must output the real final counter values');
assert(home.includes('name="message"'), 'Quote form must be prerendered');
assert(!home.includes('style="opacity:0'), 'Initial content must not be hidden by animation');
const sitemap = read('sitemap.xml');
assert(sitemap.includes('/proekti</loc>'), 'Project index must be included in the sitemap');
for (const project of publishedProjects) {
  const html = read(`proekti/${project.data.slug}/index.html`);
  assert(!html.includes('<astro-island'), `${project.data.slug} must render without hydration`);
  assert(!html.includes('data-astro-island'), `${project.data.slug} must not hydrate project content`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${project.data.slug} must have one H1`);
  assert(html.includes(`<meta name="robots" content="${project.data.noindex ? 'noindex, follow' : 'index, follow'}"`), `${project.data.slug} has incorrect robots metadata`);
  assert(html.includes('<link rel="canonical"'), `${project.data.slug} must have a canonical URL`);
  assert(html.includes('application/ld+json'), `${project.data.slug} must include JSON-LD`);
  assert(html.includes('Липсва'), `${project.data.slug} must show missing technical facts`);
  assert(html.includes(project.data.problem) && html.includes(project.data.reshenie) && html.includes(project.data.rezultat), `${project.data.slug} must prerender its case study content`);
  assert(!sitemap.includes(`${project.url}</loc>`), `${project.data.slug} is noindex and must not appear in sitemap`);
  for (const photo of project.data.snimki) {
    assert(html.includes(`src="${photo.src}"`), `${project.data.slug} is missing rendered image ${photo.src}`);
    assert(readFileSync(join('public', photo.src.slice(1))).length > 0, `Missing public project image ${photo.src}`);
  }
}
const redirects = read('_redirects');
for (const project of publishedProjects.filter(({ data }) => data.oldUrl)) {
  assert(redirects.includes(`${project.data.oldUrl} ${project.url} 301`), `${project.data.slug} must have a 301 redirect from ${project.data.oldUrl}`);
}
const sectionIds = [...home.matchAll(/<section id="([^"]+)"/g)].map(match => match[1]);
assert.deepEqual(sectionIds, ['hero', 'stats', 'services', 'problems', 'why-choose-us', 'benefits', 'faq', 'contact']);
for (const image of ['logo-navbar.png', 'logo-hero-footer.png']) {
  assert(home.includes(image), `Missing original logo: ${image}`);
  assert(readFileSync(join('dist/images/site', image)).length > 0);
}
for (const [slug, service] of Object.entries(services)) {
  if (slug !== 'mnogoslojni') continue;
  const html = read(`nastilki/${slug}/index.html`);
  assert(html.includes(service.description), `Missing original description for ${slug}`);
  assert(html.includes(service.description2), `Missing secondary description for ${slug}`);
  for (const image of service.gallery) assert(html.includes(image), `Missing gallery image for ${slug}`);
  assert(!html.includes('visibility:hidden'), `Gallery hidden before hydration for ${slug}`);
}
function* htmlFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}
let pages = 0;
for (const path of htmlFiles('dist')) {
  const html = readFileSync(path, 'utf8');
  assert(!html.includes('\u0000') && !html.includes('\ufffd'), `Corrupted text in ${path}`);
  assert(!/<astro-island[^>]*component-url="[^"]*(Navbar|Footer|HomePage|ServicePageLayout)/.test(html), `Whole-page/static component hydration in ${path}`);
  assert(!html.includes('style="opacity:0'), `Hidden initial content in ${path}`);
  if (path.includes('blogove') || path.includes('galeria')) {
    assert(!html.includes('<astro-island'), `Unexpected React hydration in ${path}`);
  }
  pages++;
}
console.log(`Static HTML checks passed for ${pages} pages; homepage hydrates only the quote form.`);
